import { DocumentType } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/booking.dto';
import { Booking, BookingModel, BookingStatus } from '../models/booking/booking.entity';
import { User } from '../models/user/user.entity';
class BookingController {

    public async getByRange(from: Date, to: Date): Promise<DocumentType<Booking>[]> {
        const bookings = await BookingModel
            .find({
                from: {
                    $lt: to
                },
                to: {
                    $gt: from
                }
            })
            .populate('bookedBy', {
                fullName: true
            })
            .exec();
        return bookings;
    }

    public async getPendingApproval(): Promise<DocumentType<Booking>[]> {
        return await BookingModel.find({
            status: BookingStatus.reserved
        })
            .populate('bookedBy', { fullName: true })
            .exec();
    }

    public async getById(id: string): Promise<DocumentType<Booking>> {
        const booking = await BookingModel
            .findOne({
                _id: id
            }).exec();
        return booking;
    }

    public async create(dto: CreateBookingDto, user: User) {
        const booking = await BookingModel.create({
            _id: undefined,
            ...dto,
            bookedBy: user._id,
            paid: false,
            pricePpl: 0,
            priceTub: 0,
            status: BookingStatus.reserved,
            adminComment: ''
        })

        return booking;
    }

    public async changeStatus({ id, ...data }: ChangeBookingStatusDto) {

        await BookingModel.updateOne({
            _id: id
        }, data);

        //TODO send email to booker if booking has been approved or declined
        return await BookingModel.findOne({ _id: id });
    }

    public async delete(id: string) {
        await BookingModel.deleteOne({
            _id: id
        });
    }
}

export default BookingController;