import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { format, isSameDay, parse as parseFn } from 'date-fns';
import faker from 'faker';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import MissingPermissionsException from '../../exceptions/MissingPermissionsException';
import BankInformationModel from '../../models/bankinformation/BankInformation';
import BookingModel, { Booking } from '../../models/booking/Booking';
import { ReservationStatus } from '../../models/booking/ReservationStatus';
import UserModel, { User } from '../../models/user/User';
import { UserRole } from '../../models/user/UserRole';
import { hashPasswordSync } from '../../utils/security';
import { SetupData, setupTest } from '../../__tests__/setup';
import { TestData } from '../../__tests__/TestData';

chai.should();
chai.use(chaiAsPromised);

const dateFormat = 'yyyy-MM-dd';
const parse = (str: string) => parseFn(str, dateFormat, new Date());

const userBasic: User = TestData.user({ roles: [UserRole.basic] });
const userBasicRandom: User = TestData.user({ roles: [UserRole.basic] });
const userAdmin: User = TestData.user({ roles: [UserRole.admin] });

const bookingAccepted = TestData.booking({
    from: faker.date.soon(31, parse("2021-02-02")),
    status: ReservationStatus.Accepted,
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
    TestData.booking({ from: faker.date.soon(30, parse("2021-02-02")), bookedBy: userBasic }),
]

describe('booking.controller', () => {

    let config: SetupData;

    const container = () => config.container;
    const controller = () => container().bookingController;

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
        await UserModel.create([userBasic, userAdmin, userBasicRandom].map(x => ({ ...x, password: hashPasswordSync(x.password) })));
        await BookingModel.create(bookings);
        await BankInformationModel.create(TestData.bankInformation())
    })

    afterEach(async () => {
        await BookingModel.deleteMany({});
        await UserModel.deleteMany({});
        await BankInformationModel.deleteMany({});
    })

    describe('create', () => {

        it('as basic user', async () => {
            const { from, to, guests, currency, items } = TestData.booking();
            const created = await controller().create({
                from,
                to,
                currency,
                guests,
                items: items.map(x => ({
                    quantity: x.quantity,
                    unit: x.unit as Types.ObjectId,
                }))
            }, userBasic);

            expect(isSameDay(from, created.from)).to.eq(true);
            expect(isSameDay(to, created.to)).to.eq(true);
        })

        it('as admin', async () => {
            const { from, to, guests, currency, items } = TestData.booking();
            const created = await controller().create({
                from,
                to,
                currency,
                guests,
                items: items.map(x => ({
                    quantity: x.quantity,
                    unit: x.unit as Types.ObjectId,
                }))
            }, userAdmin);

            expect(isSameDay(from, created.from)).to.eq(true);
            expect(isSameDay(to, created.to)).to.eq(true);
        })
    })

    describe('delete', () => {

        it('as owner', async () => {
            const booking = bookings[0];
            const id = booking._id!;
            await controller().delete(id, booking.bookedBy as User);

            const deleted = await BookingModel.findById(id);
            expect(deleted).to.eq(null);
        })

        it('as anonymous user', async () => {
            const booking = bookings[0];
            const id = booking._id!;
            await controller().delete(id, userAdmin)
                .should.eventually.be.rejectedWith(MissingPermissionsException);
        })
    })

    describe('get (many with filters)', () => {

        it('all within range', async () => {
            const results = await controller().search({
                $and: [
                    { to: { $gte: parse('2021-01-01') } },
                    { from: { $lte: parse('2021-02-01') } }
                ]
            });
            expect(results.length).to.eq(5);
        })

        it('with status accepted', async () => {
            const results = await controller().search({ status: ReservationStatus.Accepted });

            expect(results.length).to.eq(1);
            expect(String(results[0]._id)).to.eq(String(bookingAccepted._id));
        })

        it('all as anonymous user', async () => {
            const results = await controller().search({});
            results.forEach(x => {
                expect(x).to.not.have.property('bookedBy');
                expect(x).to.not.have.property('status');
                expect(x).to.not.have.property('tubCount');
                expect(x).to.not.have.property('pplCount');
            })
        })

        it('all as basic user', async () => {
            const results = await controller().search({}, userBasicRandom);
            results.forEach(x => {
                expect(x).to.not.have.property('bookedBy');
                expect(x).to.not.have.property('status');
                expect(x).to.not.have.property('tubCount');
                expect(x).to.not.have.property('pplCount');
            })
        })

        it('all as basic user with bookings', async () => {
            const results = await controller().search({}, userBasic);
            results.forEach(x => {
                expect(x).to.have.property('bookedBy');
                expect(x).to.have.property('status');
                expect(x).to.have.property('from');
                expect(x).to.have.property('to');
            })
        })
    })

    describe('changeStatus', () => {
        it('of normal booking from reserved to accepted', async () => {
            const result = await controller().updateStatus(bookings[0]._id!, ReservationStatus.Accepted)
            expect(result.status).to.eq(ReservationStatus.Accepted);
            //check that email is sent.
        })
    })
})
