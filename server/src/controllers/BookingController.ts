import { Types } from 'mongoose';
import { IContainer } from '../container';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import { BasicBooking, Booking, BookingStatus } from '../models/booking/BookingModels';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/BookingViewModels';
import { User, UserRole } from '../models/user/UserModels';
import { IBookingRepository } from '../repositories/BookingRepository';
import { IUserRepository } from '../repositories/UserRepository';
import Mapper from '../utils/Mapper';
import { IBankInformationController } from './BankInformationController';
import { IMailController } from './MailController';
import { IPriceMatrixController } from './PriceMatrixController';

export interface IBookingController {
    get(from?: Date, to?: Date, status?: BookingStatus): Promise<BasicBooking[]>
    getById(id: string): Promise<Booking>
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

    public async get(from?: Date, to?: Date, status?: BookingStatus): Promise<BasicBooking[]> {
        const bookings = await this.bookingRepository.find({
            from, to, status
        })
        return bookings.map(Mapper.toViewBasicBooking);
    }

    public async getById(id: string): Promise<Booking> {
        return this.bookingRepository.findById(Types.ObjectId(id));
    }

    public async create(dto: CreateBookingDto, user: User): Promise<BasicBooking> {
        const priceDetails = await this.priceMatrixController.calculatePrice(dto);

        const booking = await this.bookingRepository.create(
            {
                from: new Date(dto.from),
                to: new Date(dto.to),
                pplCount: dto.pplCount,
                tubCount: dto.tubCount,
                comment: dto.comment,
                bookedBy: user._id,
                pricePpl: priceDetails.priceTotal,
                priceTub: priceDetails.tubPriceTotal,
                status: user.roles.includes(UserRole.admin) ? BookingStatus.accepted : BookingStatus.reserved
            }
        )

        if (!user.roles.includes(UserRole.admin)) {
            await this.mailController.sendReceipt(booking, user);
        }
        return Mapper.toViewBasicBooking(booking);
    }

    public async changeStatus(id: Types.ObjectId, data: ChangeBookingStatusDto): Promise<BasicBooking> {
        const booking = await this.bookingRepository.update(id, data);
        const bookedBy = await this.userRepository.findById((booking.bookedBy as User)._id);

        if (!bookedBy.roles.includes(UserRole.admin)) {
            if (booking.status === BookingStatus.accepted) {
                const bankInfo = await this.bankInformationController.current();
                await this.mailController.sendConfirmation(booking, booking.bookedBy as User, bankInfo);
            } else {
                await this.mailController.sendRejection(booking, booking.bookedBy as User);
            }
        }
        return Mapper.toViewBasicBooking(booking);
    }

    public async delete(id: string, user: User) {
        const existing = await this.getById(id);
        const bookedBy = existing.bookedBy as User;

        if (user._id.toHexString() !== bookedBy._id.toHexString()) {
            throw new MissingPermissionsException();
        }

        await this.bookingRepository.delete(Types.ObjectId(id));
    }
}
