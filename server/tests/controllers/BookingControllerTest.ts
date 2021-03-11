import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { format, isSameDay, parse as parseFn } from 'date-fns';
import faker from 'faker';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { hashPasswordSync } from '../../src/utils/security';
import { IContainer } from '../../src/container';
import { IBookingController } from '../../src/controllers/BookingController';
import { IDbHandler } from '../../src/DbHandler';
import MissingPermissionsException from '../../src/exceptions/MissingPermissionsException';
import { Booking, BookingModel, BookingStatus } from '../../src/models/booking/BookingModels';
import { User, UserModel, UserRole } from '../../src/models/user/UserModels';
import { setupTest } from '../setup';
import { TestData } from '../testData';

chai.should();
chai.use(chaiAsPromised);

const dateFormat = 'yyyy-MM-dd';
const parse = (str: string) => parseFn(str, dateFormat, new Date());

const userBasic: User = TestData.user({ roles: [UserRole.basic] });
const userAdmin: User = TestData.user({ roles: [UserRole.admin] });

const bookingAccepted = TestData.booking({
    from: faker.date.soon(31, parse("2021-02-01")),
    status: BookingStatus.accepted,
    bookedBy: userBasic
});
const bookings: Booking[] = [
    //to date will automatically be up to 5 days after from date
    TestData.booking({ from: faker.date.soon(25, parse("2020-12-01")), bookedBy: userBasic }),
    TestData.booking({ from: faker.date.soon(25, parse("2020-12-01")), bookedBy: userBasic }),

    TestData.booking({ to: parse("2021-01-01"), bookedBy: userBasic }),
    TestData.booking({ from: parse("2021-01-07"), bookedBy: userBasic }),
    TestData.booking({ from: parse("2021-01-15"), bookedBy: userBasic }),
    TestData.booking({ from: parse("2021-01-25"), bookedBy: userBasic }),
    TestData.booking({ from: parse("2021-01-31"), bookedBy: userBasic }),

    bookingAccepted,
    TestData.booking({ from: faker.date.soon(30, parse("2021-02-01")), bookedBy: userBasic }),
]

describe('booking.controller', () => {

    let container: IContainer;
    let dbHandler: IDbHandler;
    let mongo: MongoMemoryServer;
    let controller: IBookingController;

    before(async () => {
        const setup = await setupTest();
        container = setup.container;
        dbHandler = setup.dbHandler;
        mongo = setup.mongo;
        controller = container.bookingController;
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
        await UserModel.create([userBasic, userAdmin].map(x => ({ ...x, password: hashPasswordSync(x.password) })));
        await BookingModel.create(bookings);
    })

    afterEach(async () => {
        await BookingModel.deleteMany({});
        await UserModel.deleteMany({});
    })

    describe('create', () => {

        it('as basic user', async () => {
            const { from, to, pplCount, tubCount, comment } = TestData.booking();
            const created = await controller.create({
                from: format(from, dateFormat),
                to: format(to, dateFormat),
                pplCount,
                tubCount,
                comment
            }, userBasic);

            expect(isSameDay(from, created.from)).to.eq(true);
            expect(isSameDay(to, created.to)).to.eq(true);
        })

        it('as admin', async () => {
            const { from, to, pplCount, tubCount, comment } = TestData.booking();
            const created = await controller.create({
                from: format(from, dateFormat),
                to: format(to, dateFormat),
                pplCount,
                tubCount,
                comment
            }, userAdmin);

            expect(isSameDay(from, created.from)).to.eq(true);
            expect(isSameDay(to, created.to)).to.eq(true);
        })
    })

    describe('delete', () => {

        it('as owner', async () => {
            const booking = bookings[0];
            const id = booking._id;
            await controller.delete(id.toHexString(), booking.bookedBy as User);

            const deleted = await BookingModel.findById(id);
            expect(deleted).to.eq(null);
        })

        it('as anonymous user', async () => {
            const booking = bookings[0];
            const id = booking._id;
            await controller.delete(id.toHexString(), userAdmin)
                .should.eventually.be.rejectedWith(MissingPermissionsException);
        })
    })

    describe('getById', () => {

        it('any', async () => {
            const booking = bookings[1];
            const b = await controller.getById(booking._id.toHexString());

            const bookedBy = b.bookedBy as User;
            expect(bookedBy._id.toHexString()).to.eq((booking.bookedBy as User)._id.toHexString());
        })
    })

    describe('get (many with filters)', () => {

        it('all for january', async () => {
            const results = await controller.get(parse('2021-01-01'), parse('2021-02-01'));

            expect(results.length).to.eq(5);
        })

        it('with status accepted', async () => {
            const results = await controller.get(undefined, undefined, BookingStatus.accepted);

            expect(results.length).to.eq(1);
            expect(results[0]._id.toHexString()).to.eq(bookingAccepted._id.toHexString());
        })
    })

    describe('changeStatus', () => {
        it('of normal booking from reserved to accepted', async () => {
            const result = await controller.changeStatus(bookings[0]._id,
                {
                    status: BookingStatus.accepted,
                    messageFromAdmin: 'test'
                })

            expect(result.status).to.eq(BookingStatus.accepted);
            //check that email is sent.
        })
    })
})
