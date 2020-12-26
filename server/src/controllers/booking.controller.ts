import { DocumentType } from '@typegoose/typegoose';
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

    public async create(dto: CreateBookingDto, user: User) {
        const booking = await BookingModel.create({
            ...dto,
            bookedBy: user._id,
            paid: false,
            pricePpl: 0,
            priceTub: 0,
            status: BookingStatus.reserved
        })

        //TODO send email to admin and booker
        return booking;
    }

    public async changeStatus(dto: ChangeBookingStatusDto) {
        const { id, ...data } = dto;
        await BookingModel.updateOne({
            _id: id
        }, data);

        //TODO send email to booker if booking has been approved or declined
        return await BookingModel.findOne({ _id: id });
    }
}

export default BookingController;