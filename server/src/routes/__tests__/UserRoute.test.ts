// Import the dependencies for testing
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import App from '../../app';
import container from '../../container';
import UserModel from '../../models/user/User';
import { UserRole } from '../../models/user/UserRole';
import { createToken } from '../../utils/security';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';
// Configure chai
chai.use(chaiHttp);
chai.should();

const app = new App([container.userRoute]);
const serverInstance = app.listen();
const server = app.getServer();

const userUnverified = TestData.user();
const userVerified = TestData.user({ roles: [UserRole.basic, UserRole.read] })
const testUsers = [
    userUnverified,
    userVerified
]

describe('users', () => {
    let config: SetupData;
    describe('GET /self', () => {
        before(async () => {
            config = await setupTest();
            UserModel.create(testUsers)
        })
        after(async () => {
            await config.teardown();
            UserModel.deleteMany({});
            serverInstance.close();
        })
        it("get self with no cookie", (done) => {
            chai.request(server)
                .get('/users/self')
                .end((err: any, res) => {
                    res.should.have.status(401);
                    done();
                })
        })

        it("get self when not allowed to login", (done) => {

            const tokenData = createToken(userUnverified, 3600);
            chai.request(server)
                .get('/users/self')
                .set('Cookie', `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`)
                .end((err: any, res) => {
                    res.should.have.status(403);
                    expect(res).to.be.json;
                    JSON.parse(res.text).should.have.property('message', 'Missing permission')
                    JSON.parse(res.text).should.have.property('status', 403)
                    done();
                })

        })

        it("get self when verified", (done) => {

            const tokenData = createToken(userVerified, 3600);
            chai.request(server)
                .get('/users/self')
                .set('Cookie', `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`)
                .end((err: any, res) => {
                    res.should.have.status(200);
                    const body = JSON.parse(res.text);
                    body.should.have.property('_id', String(userVerified._id));                    
                    done();
                })

        })
    })
})