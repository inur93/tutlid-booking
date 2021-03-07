import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import faker from 'faker';
import { before, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IContainer } from '../../src/container';
import { IAuthenticationController } from '../../src/controllers/authentication.controller';
import { IDbHandler } from '../../src/DbHandler';
import InvalidCredentialsException from '../../src/exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../../src/exceptions/UserWithThatEmailAlreadyExistsException';
import { UserModel, UserRole, UserStatus } from '../../src/models/user/user.entity';
import { setupTest } from '../setup';
import { TestData } from '../testData';

chai.should();
chai.use(chaiAsPromised);

const testUser = TestData.user({
    status: UserStatus.approved
});

describe('authentication.controller', () => {

    let container: IContainer;
    let dbHandler: IDbHandler;
    let mongo: MongoMemoryServer;
    let controller: IAuthenticationController;

    before(async () => {

        const setup = await setupTest();
        container = setup.container;
        dbHandler = setup.dbHandler;
        mongo = setup.mongo;

        controller = container.authenticationController;
        await controller.register(testUser);

        //findById does not work
        const user = await UserModel.findOne({ fullName: testUser.fullName }).exec();
        user.status = UserStatus.approved;
        user.save();
    })

    after(async () => {
        try {
            await dbHandler?.disconnect();
            await mongo?.stop();
        } catch (e) {
            console.log('failed to disconnect mongo...', e);
        }
    })

    describe('register', () => {

        it('Registration success with name, email, password, UserRole.read and not deleted', async () => {
            const data = TestData.user();

            const { user } = await controller.register(data);
            expect(user?.email).to.equal(data.email);
            expect(user?.fullName).to.equal(data.fullName);
            expect(user?.roles.length).to.be.eq(1);
            expect(user?.roles[0]).to.eq(UserRole.read);
            expect(user?.status).to.be.eq(UserStatus.pendingApproval);
            expect(user?.deleted).to.be.false;
        })

        it('Registration fail, email already exists', async () => {

            await controller.register(TestData.user({ email: testUser.email }))
                .should.eventually.be.rejectedWith(UserWithThatEmailAlreadyExistsException)
        })

    })

    describe('login', () => {
        it('successful', (done) => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            }
            controller.login(loginData).should.eventually.be.fulfilled.and.notify(done)
        })

        it('should contain valid data', async () => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            }
            const { user } = await controller.login(loginData);

            expect(user?.deleted).to.not.eq(true);
            expect(user?.email).to.eq(testUser.email);
            expect(user?.roles).to.include(UserRole.read);
            expect(user?.status).to.eq(UserStatus.approved);
        })

        it('login unsuccessfully, wrong password', (done) => {
            controller.login({ email: testUser.email, password: faker.internet.password(12) })
                .should.eventually.be.rejectedWith(InvalidCredentialsException).and.notify(done)
        })
    })

})
