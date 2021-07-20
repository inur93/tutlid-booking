import { FilterQuery, Types } from 'mongoose';
import { IContainer } from '../container';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import { Booking, BookingDoc } from '../models/booking/Booking';
import { CreateBooking } from '../models/booking/CreateBooking';
import { GetAnonymousBooking } from '../models/booking/GetAnonymousBooking';
import { GetBooking } from '../models/booking/GetBooking';
import { ReservationStatus } from '../models/booking/ReservationStatus';
import { User } from '../models/user/User';
import { UserRole } from '../models/user/UserRole';
import { IBookingRepository } from '../repositories/BookingRepository';
import { IUserRepository } from '../repositories/UserRepository';
import { shouldBeAnonymous } from '../utils/bookingFunctions';
import Mapper from '../utils/Mapper';
import { IBankInformationController } from './BankInformationController';
import { IMailController } from './MailController';
import { IPriceController } from './PriceController';

export interface IBookingController {
    search(query: FilterQuery<BookingDoc>, user?: User): Promise<(GetBooking | GetAnonymousBooking)[]>
    create(dto: CreateBooking, user: User): Promise<GetBooking>
    updateStatus(id: Types.ObjectId, status: ReservationStatus): Promise<GetBooking>
    delete(id: Types.ObjectId, user: User): Promise<void>
}
export default class BookingController implements IBookingController {

    private readonly bookingRepository: IBookingRepository;

    private readonly bankInformationController: IBankInformationController;
    private readonly userRepository: IUserRepository;
    private readonly mailController: IMailController;
    private readonly priceController: IPriceController;
    constructor({
        bookingRepository,
        bankInformationController,
        priceController,
        userRepository,
        mailController
    }: IContainer) {
        this.bookingRepository = bookingRepository;
        this.bankInformationController = bankInformationController;
        this.userRepository = userRepository;
        this.mailController = mailController;
        this.priceController = priceController;
    }

    public async search(query: FilterQuery<BookingDoc>, user?: User): Promise<(GetBooking | GetAnonymousBooking)[]> {
        const bookings = await this.bookingRepository.find(query)
        return bookings.map(x => {
            return shouldBeAnonymous(x, user) ?
                Mapper.toGetAnonymousBooking(x) :
                Mapper.toGetBooking(x)
        });
    }

    private async getById(id: Types.ObjectId, user?: User): Promise<Booking> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) throw new Error(`Booking with id ${id} does not exist.`)
        return booking;
    }

    public async create(booking: CreateBooking, user: User): Promise<GetBooking> {
        const withPrice = await this.priceController.applyPrice(booking, user);
        const created = await this.bookingRepository.create(
            {
                ...withPrice,
                paidAmount: 0,
                bookedBy: user._id!,
                status: user.roles.includes(UserRole.admin) ? ReservationStatus.Accepted : ReservationStatus.Reserved
            }
        )

        if (!user.roles.includes(UserRole.admin)) {
            await this.mailController.sendReceipt(withPrice, user);
        }
        return Mapper.toGetBooking(created);
    }

    public async updateStatus(id: Types.ObjectId, status: ReservationStatus): Promise<GetBooking> {

        const booking = await this.bookingRepository.findById(id);
        if (!booking) throw new Error(`Booking with id ${id} does not exist.`);
        booking.status = status;
        booking.save();

        const withUser = await booking.populate('bookedBy').execPopulate();
        const bookedBy = withUser.bookedBy as User;
        if (!bookedBy.roles.includes(UserRole.admin)) {
            if (status === ReservationStatus.Accepted) {
                const bankInfo = await this.bankInformationController.current();
                if (!bankInfo) throw new Error('No bank information is available.');
                await this.mailController.sendConfirmation(booking, bookedBy, bankInfo);
            } else {
                await this.mailController.sendRejection(booking, bookedBy);
            }
        }
        return Mapper.toGetBooking(booking);
    }

    public async delete(id: Types.ObjectId, user: User) {
        const existing = await this.getById(id);
        const bookedBy = existing.bookedBy as User;

        if (String(user._id) !== String(bookedBy._id)) {
            throw new MissingPermissionsException();
        }

        await this.bookingRepository.delete(id);
    }
}
