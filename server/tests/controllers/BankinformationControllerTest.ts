import { fail } from 'assert';
import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { before, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IContainer } from '../../src/container';
import { IBankInformationController } from '../../src/controllers/BankInformationController';
import { IDbHandler } from '../../src/DbHandler';
import { BankInformation, BankInformationModel } from '../../src/models/bankinformation/BankInformationModels';
import { setupTest } from '../setup';
import { TestData } from '../testData';

chai.should();
chai.use(chaiAsPromised);

const testBankInfo: BankInformation = TestData.bankInformation();

describe('bankinformation.controller', () => {

    let container: IContainer;
    let dbHandler: IDbHandler;
    let mongo: MongoMemoryServer;
    let controller: IBankInformationController;

    before(async () => {
        const setup = await setupTest();
        container = setup.container;
        dbHandler = setup.dbHandler;
        mongo = setup.mongo;
        controller = container.bankInformationController;
        await BankInformationModel.create(testBankInfo);
    })

    after(async () => {
        try {
            await dbHandler?.disconnect();
            await mongo?.stop();
        } catch (e) {
            console.log('failed to disconnect mongo...', e);
        }
    })

    describe('current', () => {

        it('regNo and accountNo exist', async () => {

            const info = await controller.current();
            if(!info){
                fail('info should contain data');
            }
            expect(info.accountNo).to.eq(testBankInfo.accountNo);
            expect(info.regNo).to.eq(testBankInfo.regNo);
        })
    })

    describe('update', () => {

        it('with success', async () => {
            const { _id, ...data } = TestData.bankInformation();
            const update = await controller.update(testBankInfo._id, data);
            expect(update.regNo).to.eq(data.regNo);
            expect(update.accountNo).to.eq(data.accountNo);
        })
    })

})
