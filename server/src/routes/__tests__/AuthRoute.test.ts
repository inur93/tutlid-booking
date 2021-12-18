// Import the dependencies for testing
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import App from '../../app';
import container from '../../container';
import UserModel from '../../models/user/User';
import { UserRole } from '../../models/user/UserRole';
import { createToken, getJwtSecret, hashPasswordSync } from '../../utils/security';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';
import setCookie from 'set-cookie-parser';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../../models/auth/dataStoredInToken';
// Configure chai
chai.use(chaiHttp);
chai.should();

const app = new App([container.authRoute]);
const serverInstance = app.listen();
const server = app.getServer();

const userUnverified = TestData.user();
const userVerified = TestData.user({
    roles: [UserRole.basic, UserRole.read],
    password: hashPasswordSync('test')
})
const testUsers = [
    userUnverified,
    userVerified
]

describe('auth', () => {
    let config: SetupData;
    before(async () => {
        config = await setupTest();
        UserModel.create(testUsers)
    })
    after(async () => {
        await config.teardown();
        UserModel.deleteMany({});
        serverInstance.close();
    })
    describe('POST /login', () => {

        it("make succesful login with valid token", (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    email: userVerified.email,
                    password: 'test'
                })
                .end((err: any, res) => {
                    res.should.have.status(200);
                    const cookies = setCookie.parse(res.header['set-cookie']);
                    const authCookie = cookies.find(x => x.name === "Authorization");
                    chai.assert.isNotEmpty(authCookie);
                    chai.assert.equal(authCookie?.httpOnly, true)
                    const content = jwt.verify(authCookie?.value || '', getJwtSecret()) as DataStoredInToken;
                    chai.assert.equal(content.id, String(userVerified._id));
                    chai.assert.equal(content.email, String(userVerified.email));
                    done();
                })
        })

        it("make unsuccesful login", (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    email: userVerified.email,
                    password: 'test1'
                })
                .end((err: any, res) => {
                    res.should.have.status(401);
                    done();
                })
        })
        // it("get self when not allowed to login", (done) => {

        //     const tokenData = createToken(userUnverified, 3600);
        //     chai.request(server)
        //         .get('/users/self')
        //         .set('Cookie', `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`)
        //         .end((err: any, res) => {
        //             res.should.have.status(403);
        //             expect(res).to.be.json;
        //             JSON.parse(res.text).should.have.property('message', 'Missing permission')
        //             JSON.parse(res.text).should.have.property('status', 403)
        //             done();
        //         })

        // })

        // it("get self when verified", (done) => {

        //     const tokenData = createToken(userVerified, 3600);
        //     chai.request(server)
        //         .get('/users/self')
        //         .set('Cookie', `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`)
        //         .end((err: any, res) => {
        //             res.should.have.status(200);
        //             const body = JSON.parse(res.text);
        //             body.should.have.property('_id', String(userVerified._id));
        //             done();
        //         })

        // })
    })
})