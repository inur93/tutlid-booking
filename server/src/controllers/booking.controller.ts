import { DocumentType } from '@typegoose/typegoose';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/booking.dto';
import { Booking, BookingModel, BookingStatus } from '../models/booking/booking.entity';
import { User, UserRole } from '../models/user/user.entity';
import PriceMatrixController from './pricematrix.controller';
class BookingController {
    private priceMatrixController = new PriceMatrixController();
    public async get(from?: Date, to?: Date, status?: BookingStatus): Promise<DocumentType<Booking>[]> {

        let query: any = {};
        if (from) query.to = { $gt: from };
        if (to) query.from = { $lt: to };
        if (status) query.status = status;
        const bookings = await BookingModel
            .find(query)
            .populate('bookedBy', {
                fullName: true
            })
            .exec();
        return bookings;
    }

    public async getById(id: string): Promise<DocumentType<Booking>> {
        const booking = await BookingModel
            .findOne({
                _id: id
            }).exec();
        return booking;
    }

    public async create(dto: CreateBookingDto, user: User) {
        const priceDetails = await this.priceMatrixController.calculatePrice(dto);
        const booking = await BookingModel.create({
            _id: undefined,
            ...dto,
            bookedBy: user._id,
            paid: false,
            pricePpl: priceDetails.priceTotal,
            priceTub: priceDetails.tubPriceTotal,
            status: user.roles.includes(UserRole.admin) ? BookingStatus.accepted : BookingStatus.reserved,
            messageFromAdmin: ''
        })

        return booking;
    }

    public async changeStatus({ id, ...data }: ChangeBookingStatusDto): Promise<DocumentType<Booking>> {

        await BookingModel.updateOne({
            _id: id
        }, data);

        return await BookingModel.findOne({ _id: id }, undefined, { populate: 'bookedBy' });
    }

    public async delete(id: string) {
        await BookingModel.deleteOne({
            _id: id
        });
    }
}

export default BookingController;