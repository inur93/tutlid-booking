import { fail } from 'assert';
import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { before, describe, it } from 'mocha';
import { Types } from 'mongoose';
import NotFoundException from '../../exceptions/NotFoundException';
import UserModel from '../../models/user/User';
import { UserRole } from '../../models/user/UserRole';
import { UserStatus } from '../../models/user/UserStatus';
import { hashPasswordSync } from '../../utils/security';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';

chai.should();
chai.use(chaiAsPromised);

const userApproved = TestData.user({
    status: UserStatus.approved,
    roles: [UserRole.read, UserRole.basic]
});

describe('UserController', () => {

    let config: SetupData;

    const container = () => config.container;
    const controller = () => container().userController;

    before(async () => {

        config = await setupTest();
        await container().authenticationController.register(userApproved);

        //findById does not work
        const user = await UserModel.findOne({ fullName: userApproved.fullName }).exec();

        if (user) {
            user.status = UserStatus.approved;
            user.save();
        } else {
            fail();
        }
    })

    after(async () => {
        try {
            await config?.teardown()
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

        it('getself with name and email', async () => {

            const { email, fullName } = await controller().getSelf(userApproved._id!);

            expect(email).to.be.not.empty;
            expect(fullName).to.be.not.empty;
        })

        it('GetSelf with random id', async () => {
            await controller().getSelf(new Types.ObjectId())
                .should.eventually.be.rejectedWith(NotFoundException);
        })
    })

    describe('getById', () => {
        it('get only fullname and id', async () => {

            const user = await controller().getById(userApproved._id!);
            expect(user).to.have.property('fullName');
            expect(user).to.have.property('_id');
            expect(user).to.not.have.property('status');
            expect(user).to.not.have.property('roles');
            expect(user).to.not.have.property('password');

        })

        it('get with random id', async () => {
            await controller().getById(new Types.ObjectId())
                .should.eventually.be.rejectedWith(NotFoundException);
        })
    })

    describe('addRole', () => {
        it('admin role', async () => {
            const user = await controller().addRole(userApproved._id!, UserRole.admin);
            const updated = await controller().getDetailsById(userApproved._id!);
            expect(user.roles).includes(UserRole.admin);
            expect(updated.roles).includes(UserRole.admin);
        })
    })

    describe('removeRole', () => {
        it('basic role', async () => {
            const user = await controller().removeRole(userApproved._id!, UserRole.basic);
            const updated = await controller().getDetailsById(userApproved._id!);
            expect(user.roles).to.not.includes(UserRole.basic);
            expect(updated.roles).to.not.includes(UserRole.basic);
        })
    })

    describe('changeStatus', () => {
        it('to rejected', async () => {
            const user = await controller().changeStatus(userApproved._id!, UserStatus.rejected);

            expect(user.status).to.equal(UserStatus.rejected);
            expect(user.roles).to.not.include(UserRole.basic);
            expect(user.roles).to.not.include(UserRole.admin);
        })

        it('to approved', async () => {
            UserModel.updateOne({ _id: userApproved._id }, { $set: { status: UserStatus.pendingApproval } });
            const user = await controller().changeStatus(userApproved._id!, UserStatus.approved);

            expect(user.status).to.equal(UserStatus.approved);
            expect(user.roles).to.include(UserRole.basic);
        })
    })

    describe('getDetailsById', () => {
        it('for any user', async () => {
            const user = await controller().getDetailsById(userApproved._id!);
            expect(user).to.have.property('deleted');
            expect(user.email).to.equal(userApproved.email);
            expect(user.fullName).to.equal(userApproved.fullName);
            expect(user.status).to.equal(userApproved.status);
            expect(user.roles.length).to.equal(userApproved.roles.length);
        })
    })
    // controller().addRole
    // controller().changeStatus
    // controller().removeRole
    // controller().getDetailsById
    // controller().update
    // controller().get

})
