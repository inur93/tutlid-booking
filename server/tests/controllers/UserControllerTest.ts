import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { before, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IContainer } from '../../src/container';
import { IUserController } from '../../src/controllers/UserController';
import { IDbHandler } from '../../src/DbHandler';
import { UserModel, UserRole, UserStatus } from '../../src/models/user/UserModels';
import { hashPasswordSync } from '../../src/utils/security';
import { setupTest } from '../setup';
import { TestData } from '../testData';

chai.should();
chai.use(chaiAsPromised);

const userApproved = TestData.user({
    status: UserStatus.approved,
    roles: [UserRole.read, UserRole.basic]
});

describe('UserController', () => {

    let container: IContainer;
    let dbHandler: IDbHandler;
    let mongo: MongoMemoryServer;
    let controller: IUserController;

    before(async () => {

        const setup = await setupTest();
        container = setup.container;
        dbHandler = setup.dbHandler;
        mongo = setup.mongo;

        controller = container.userController;
        await container.authenticationController.register(userApproved);

        //findById does not work
        const user = await UserModel.findOne({ fullName: userApproved.fullName }).exec();
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

    beforeEach(async () => {
        await UserModel.create([userApproved].map(x => ({ ...x, password: hashPasswordSync(x.password) })));
    })

    afterEach(async () => {
        await UserModel.deleteMany({});
    })

    describe('getSelf', () => {

        it('getself with status and roles', async () => {

            const { status, deleted, roles } = await controller.getSelf(userApproved._id);
            expect(status).to.equal(UserStatus.approved);
            expect(deleted).to.equal(false);
            expect(roles[0]).to.eq(UserRole.read);
        })
    })

    describe('getById', () => {
        it('get only fullname and id', async () => {

            const user = await controller.getById(userApproved._id);
            expect(user).to.have.property('fullName');
            expect(user).to.have.property('_id');
            expect(user).to.not.have.property('status');
            expect(user).to.not.have.property('roles');
            expect(user).to.not.have.property('password');

        })


    })

})
