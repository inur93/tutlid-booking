import faker from 'faker';
import { before, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { stub } from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { IContainer } from '../../src/container';
import MailController from '../../src/controllers/mail.controller';
import AdminRoute from '../../src/routes/admin.route';
import AuthRoute from '../../src/routes/auth.route';
import BookingRoute from '../../src/routes/booking.route';
import PriceMatrixRoute from '../../src/routes/pricematrix.route';
import UserRoute from '../../src/routes/user.route';
import DbHandler, { IDbHandler } from '../../src/DbHandler';
import UserRepository, { IUserRepository } from '../../src/repositories/user.repo';
import { IBookingRepository } from '../../src/repositories/booking.repo';
import { IPriceMatrixRepository } from '../../src/repositories/pricematrix.repo';
import { IBankInformationRepository } from '../../src/repositories/bankinformation.repo';
import { IUserController } from '../../src/controllers/user.controller';
import { IBookingController } from '../../src/controllers/booking.controller';
import { IPriceMatrixController } from '../../src/controllers/pricematrix.controller';
import { IBankInformationController } from '../../src/controllers/bankinformation.controller';
import AuthenticationController, { IAuthenticationController } from '../../src/controllers/authentication.controller';
import { UserRole, UserStatus } from '../../src/models/user/user.entity';
import InvalidCredentialsException from '../../src/exceptions/InvalidCredentialsException';

chai.should();
chai.use(chaiAsPromised);

class Container implements IContainer {
    mailController!: MailController;
    adminRoute!: AdminRoute;
    authRoute!: AuthRoute;
    bookingRoute!: BookingRoute;
    priceMatrixRoute!: PriceMatrixRoute;
    userRoute!: UserRoute;
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
        await mongo.start();
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
        try {
            await dbHandler.disconnect();
            await mongo.stop();
        } catch (e) {
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