import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { parse as parseFn } from 'date-fns';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IContainer } from '../../src/container';
import { IPriceMatrixController } from '../../src/controllers/PriceMatrixController';
import { IDbHandler } from '../../src/DbHandler';
import { BookingModel } from '../../src/models/booking/BookingModels';
import { PriceMatrix, PriceMatrixModel } from '../../src/models/pricematrix/PriceMatrixModels';
import { UserModel } from '../../src/models/user/UserModels';
import { setupTest } from '../setup';
import { TestData } from '../testData';

chai.should();
chai.use(chaiAsPromised);

const dateFormat = 'yyyy-MM-dd';
const parse = (str: string) => parseFn(str, dateFormat, new Date());

const priceMatrices: PriceMatrix[] = [
    TestData.priceMatrix({ validFrom: parse('2020-03-01'), validTo: parse('2020-03-10') }),
    TestData.priceMatrix({ validFrom: parse('2020-03-10') })
]

describe('PriceMatrixController', () => {

    let container: IContainer;
    let dbHandler: IDbHandler;
    let mongo: MongoMemoryServer;
    let controller: IPriceMatrixController;

    before(async () => {
        const setup = await setupTest();
        container = setup.container;
        dbHandler = setup.dbHandler;
        mongo = setup.mongo;
        controller = container.priceMatrixController;
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
        await PriceMatrixModel.create(priceMatrices);
    })

    afterEach(async () => {
        await BookingModel.deleteMany({});
        await UserModel.deleteMany({});
    })

    describe('get', () => {
        it('price matrix with no end date exists', async () => {
            const found = await controller.get(parse('2020-03-21'));
            expect(found.length).to.greaterThan(0);
        })
    })

})
