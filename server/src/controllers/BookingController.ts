import { Types } from 'mongoose';
import { IContainer } from '../container';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import { AnonymousBooking, BasicBooking, Booking, BookingQuery, BookingStatus } from '../models/booking/BookingModels';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/BookingViewModels';
import { User, UserRole } from '../models/user/UserModels';
import { IBookingRepository } from '../repositories/BookingRepository';
import { IUserRepository } from '../repositories/UserRepository';
import { shouldBeAnonymous } from '../utils/bookingFunctions';
import Mapper from '../utils/Mapper';
import { IBankInformationController } from './BankInformationController';
import { IMailController } from './MailController';
import { IPriceMatrixController } from './PriceMatrixController';

export interface IBookingController {
    get(query: BookingQuery, user?: User): Promise<(BasicBooking | AnonymousBooking)[]>
    create(dto: CreateBookingDto, user: User): Promise<BasicBooking>
    changeStatus(id: Types.ObjectId, data: ChangeBookingStatusDto): Promise<BasicBooking>
    delete(id: string, user: User): Promise<void>
}
export default class BookingController implements IBookingController {

    private readonly bookingRepository: IBookingRepository;

    private readonly priceMatrixController: IPriceMatrixController;
    private readonly bankInformationController: IBankInformationController;
    private readonly userRepository: IUserRepository;
    private readonly mailController: IMailController;

    constructor({
        bookingRepository,
        priceMatrixController,
        bankInformationController,
        userRepository,
        mailController
    }: IContainer) {
        this.bookingRepository = bookingRepository;
        this.priceMatrixController = priceMatrixController;
        this.bankInformationController = bankInformationController;
        this.userRepository = userRepository;
        this.mailController = mailController;
    }

    public async get(query: BookingQuery, user?: User): Promise<(BasicBooking | AnonymousBooking)[]> {
        const bookings = await this.bookingRepository.find(query)
        return bookings.map(x => {
            return shouldBeAnonymous(x, user) ?
                Mapper.toAnonymousBooking(x) :
                Mapper.toViewBasicBooking(x)
        });
    }

    private async getById(id: string, user?: User): Promise<Booking | null> {
        const booking = await this.bookingRepository.findById(Types.ObjectId(id));
        if (!booking) {
            return null;
        }
        return Mapper.toBooking(booking);
    }

    public async create(dto: CreateBookingDto, user: User): Promise<BasicBooking> {
        const priceDetails = await this.priceMatrixController.calculatePrice(dto);

        const bookingDoc = await this.bookingRepository.create(
            {
                from: new Date(dto.from),
                to: new Date(dto.to),
                guests: dto.guests,
                tubCount: dto.tubCount,
                comment: dto.comment,
                bookedBy: user._id,
                priceGuests: priceDetails.priceTotal,
                priceTub: priceDetails.tubPriceTotal,
                status: user.roles.includes(UserRole.admin) ? BookingStatus.accepted : BookingStatus.reserved
            }
        )
        if (!bookingDoc) {
            throw new Error('could not create booking');
        }
        const booking = Mapper.toBooking(bookingDoc);
        if (!user.roles.includes(UserRole.admin)) {
            await this.mailController.sendReceipt(booking, user);
        }

        const admins = await this.userRepository.findAdmins();
        for (let admin of admins) {
            var adminUser = Mapper.toUser(admin);
            if (admin._id !== user._id) {
                await this.mailController.sendAdminNotification(booking, adminUser);
            }
        }

        return Mapper.toViewBasicBooking(bookingDoc);
    }

    public async changeStatus(id: Types.ObjectId, data: ChangeBookingStatusDto): Promise<BasicBooking> {
        const bookingDoc = await this.bookingRepository.update(id, data);
        const bookedBy = await this.userRepository.findById((bookingDoc.bookedBy as User)._id);

        if (!bookingDoc) {
            throw new Error(`Booking with id ${id} doesn't exist.`);
        }
        if (!bookedBy) {
            throw new Error(`Booker with id ${(bookingDoc.bookedBy as User)._id} doesn't exist.`);
        }

        const booking = Mapper.toBooking(bookingDoc);
        if (!bookedBy.roles.includes(UserRole.admin)) {
            if (bookingDoc.status === BookingStatus.accepted) {
                const bankInfo = await this.bankInformationController.current();
                if (bankInfo) {
                    await this.mailController.sendConfirmation(booking, bookedBy as User, Mapper.toBankInformation(bankInfo));
                }
            } else {
                await this.mailController.sendRejection(booking, bookedBy as User);
            }
        }
        return Mapper.toViewBasicBooking(bookingDoc);
    }

    public async delete(id: string, user: User) {
        const existing = await this.getById(id);
        if (!existing) {
            //booking was already deleted. No need to do anything else.
            return;
        }
        const bookedBy = existing.bookedBy as User;

        if (user._id.toHexString() !== bookedBy._id.toHexString()) {
            throw new MissingPermissionsException();
        }

        await this.bookingRepository.delete(Types.ObjectId(id));
    }
}
