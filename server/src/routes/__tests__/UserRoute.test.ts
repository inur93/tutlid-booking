// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import App from '../../app';
import container from '../../container';
import { SetupData, setupTest } from '../../__tests__/setup';
// Configure chai
chai.use(chaiHttp);
chai.should();

const server = new App([container.userRoute]);
server.listen();

describe('users', () => {
    let config: SetupData;
    describe('GET /self', () => {
        before(async () => {
            config = await setupTest();
        })
        after(async () => {
            await config.teardown();
        })
        it("get self with no cookie", async () => {
            chai.request(server.getServer())
                .get('/users/self')
                .end((err: any, res) => {
                    res.should.have.status(401);
                })
        })
    })
})