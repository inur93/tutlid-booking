import { Types } from 'mongoose';
import { IContainer } from '../container';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/booking.dto';
import { Booking, BookingStatus } from '../models/booking/booking.entity';
import { User, UserRole } from '../models/user/user.entity';
import { IBookingRepository } from '../repositories/booking.repo';
import { IPriceMatrixController } from './pricematrix.controller';

export interface IBookingController {
    get(from?: Date, to?: Date, status?: BookingStatus): Promise<Booking[]>
    getById(id: string): Promise<Booking>
    create(dto: CreateBookingDto, user: User): Promise<Booking>
    changeStatus({ id, ...data }: ChangeBookingStatusDto): Promise<Booking>
    delete(id: string): Promise<void>
}
export default class BookingController implements IBookingController {
    private priceMatrixController: IPriceMatrixController;
    private bookingRepository: IBookingRepository;
    constructor({
        bookingRepository,
        priceMatrixController
    }: IContainer) {
        this.priceMatrixController = priceMatrixController;
        this.bookingRepository = bookingRepository;
    }

    public async get(from?: Date, to?: Date, status?: BookingStatus): Promise<Booking[]> {
        return await this.bookingRepository.find({
            from, to, status
        })
    }

    public async getById(id: string): Promise<Booking> {
        return await this.bookingRepository.findById(Types.ObjectId(id));
    }

    public async create(dto: CreateBookingDto, user: User) {
        const priceDetails = await this.priceMatrixController.calculatePrice(dto);

        return await this.bookingRepository.create(
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
    }

    public async changeStatus({ id, ...data }: ChangeBookingStatusDto): Promise<Booking> {
        return await this.bookingRepository.update({
            _id: id,
            ...data
        })
    }

    public async delete(id: string) {
        await this.bookingRepository.delete(Types.ObjectId(id));
    }
}
