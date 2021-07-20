import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { before, describe, it } from 'mocha';
import BankInformationModel, { BankInformation } from '../../models/bankinformation/BankInformation';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';

chai.should();
chai.use(chaiAsPromised);

const testBankInfo: BankInformation = TestData.bankInformation();

describe('bankinformation.controller', () => {

    let config: SetupData;

    const container = () => config.container;
    const controller = () => container().bankInformationController;

    before(async () => {

        config = await setupTest();
        await BankInformationModel.create(testBankInfo);
    })

    after(async () => {
        try {
            config.teardown()
        } catch (e) {
            console.log('failed to disconnect mongo...', e);
        }
    })

    describe('current', () => {

        it('regNo and accountNo exist', async () => {

            const info = await controller().current();
            expect(info?.accountNo).to.eq(testBankInfo.accountNo);
            expect(info?.regNo).to.eq(testBankInfo.regNo);
        })
    })

    describe('update', () => {

        it('with success', async () => {
            const { _id, ...data } = TestData.bankInformation();
            const update = await controller().update(testBankInfo._id!, data);
            expect(update.regNo).to.eq(data.regNo);
            expect(update.accountNo).to.eq(data.accountNo);
        })
    })

})
