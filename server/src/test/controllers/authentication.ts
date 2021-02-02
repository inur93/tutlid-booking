import faker from 'faker';
import { before, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { stub } from 'sinon';
import AuthenticationController, { IAuthenticationController } from '../../controllers/authentication.controller';
import { DbHandler, IDbHandler } from '../../DbHandler';
import UserRepository, { IUserRepository } from '../../repositories/user.repo';
import chai, { expect } from 'chai';
import { IContainer } from '../../container';
import { IBankInformationController } from '../../controllers/bankinformation.controller';
import { IBookingController } from '../../controllers/booking.controller';
import { IPriceMatrixController } from '../../controllers/pricematrix.controller';
import { IUserController } from '../../controllers/user.controller';
import { IBankInformationRepository } from '../../repositories/bankinformation.repo';
import { IBookingRepository } from '../../repositories/booking.repo';
import { IPriceMatrixRepository } from '../../repositories/pricematrix.repo';
import { UserRole, UserStatus } from '../../models/user/user.entity';
import InvalidCredentialsException from '../../exceptions/InvalidCredentialsException';
import chaiAsPromised from "chai-as-promised";

chai.should();
chai.use(chaiAsPromised);

class Container implements IContainer {
    dbHandler!: IDbHandler;
    userRepository!: IUserRepository;
    bookingRepository!: IBookingRepository;
    priceMatrixRepository!: IPriceMatrixRepository;
    bankInformationRepository!: IBankInformationRepository;
    userController!: IUserController;
    bookingController!: IBookingController;
    priceMatrixController!: IPriceMatrixController;
    bankInformationController!: IBankInformationController;
    authenticationController!: IAuthenticationController;

}

const testUser = {
    fullName: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
};

describe('authentication.controller', () => {

    const container = stub(Container).prototype;
    container.userRepository = new UserRepository();
    const controller = new AuthenticationController(container);
    const mongo = new MongoMemoryServer();
    let dbHandler: DbHandler;
    before(async () => {

        const uri = await mongo.getUri();
        const dbName = await mongo.getDbName();

        dbHandler = new DbHandler({
            createDefaults: false,
            dbName,
            uri,
            ssl: false
        });
        await dbHandler.connect();
        await controller.register(testUser);
        console.log('connected to fake db!');
    })

    after(async () => {
        try{
        await dbHandler.disconnect();
        await mongo.stop();
        }catch(e){
            console.log('failed to disconnect mongo...', e);
        }
    })


    describe('register', () => {

        it('Registration success with name, email, password, UserRole.read and not deleted', async () => {
            const data = {
                fullName: faker.name.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            };

            const user = await controller.register(data);
            expect(user.email).to.equal(data.email);
            expect(user.fullName).to.equal(data.fullName);
            expect(user.password).to.not.exist;
            expect(user.roles.length).to.be.eq(1);
            expect(user.roles[0]).to.eq(UserRole.read);
            expect(user.status).to.be.eq(UserStatus.pendingApproval);
            expect(user.deleted).to.be.false;
        })

        it('login as user successfully', (done) => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            }
            controller.login(loginData).should.eventually.be.fulfilled.and.notify(done)
        })

        it('login as user unsuccessfully', (done) => {

            controller.login({ email: testUser.email, password: faker.internet.password(12) })
                .should.eventually.be.rejectedWith(InvalidCredentialsException).and.notify(done)

        })
    })

})