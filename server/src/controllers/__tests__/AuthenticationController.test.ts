// const { should, use, expect } = require('chai');
// const chaiAsPromised = require("chai-as-promised");
import {should, use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import { before, describe, it } from 'mocha';
import InvalidCredentialsException from '../../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import UserModel from '../../models/user/User';
import { UserRole } from '../../models/user/UserRole';
import { UserStatus } from '../../models/user/UserStatus';
import { hashPasswordSync } from '../../utils/security';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';

should();
use(chaiAsPromised);

const testUser = TestData.user({
    status: UserStatus.approved,
    roles: [UserRole.read, UserRole.basic]
});

describe('AuthenticationController', () => {

    let config: SetupData;

    const container = () => config.container;
    const controller = () => container().authenticationController;

    before(async () => {

        config = await setupTest();
    })

    after(async () => {
        try {
            config.teardown()
        } catch (e) {
            console.log('failed to disconnect mongo...', e);
        }
    })

    beforeEach(async () => {
        await UserModel.create([testUser].map(x => ({ ...x, password: hashPasswordSync(x.password) })));
    })

    afterEach(async () => {
        await UserModel.deleteMany({});
    })

    describe('register', () => {

        it('Registration success with name, email, password, UserRole.read and not deleted', async () => {
            const data = TestData.user();

            const { user } = await controller().register(data);
            expect(user?.email).to.equal(data.email);
            expect(user?.fullName).to.equal(data.fullName);
            expect(user?.roles.length).to.be.eq(1);
            expect(user?.roles[0]).to.eq(UserRole.read);
            expect(user?.status).to.be.eq(UserStatus.pendingApproval);
            expect(user?.deleted).to.be.false;
        })

        it('Registration fail, email already exists', async () => {

            await controller().register(TestData.user({ email: testUser.email }))
                .should.eventually.be.rejectedWith(UserWithThatEmailAlreadyExistsException)
        })

    })

    describe('login', () => {
        it('successful', (done) => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            }
            controller().login(loginData).should.eventually.be.fulfilled.and.notify(done)
        })

        it('should contain valid data', async () => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            }
            const { user } = await controller().login(loginData);

            expect(user?.deleted).to.not.eq(true);
            expect(user?.email).to.eq(testUser.email);
            expect(user?.roles).to.include(UserRole.read);
            expect(user?.status).to.eq(UserStatus.approved);
        })

        it('login unsuccessfully, wrong password', (done) => {
            controller().login({ email: testUser.email, password: faker.internet.password(12) })
                .should.eventually.be.rejectedWith(InvalidCredentialsException).and.notify(done)
        })
    })

})
