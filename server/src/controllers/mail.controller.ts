import sendgrid from '@sendgrid/mail'
import { Booking } from '../models/booking/booking.entity';
import { User } from '../models/user/user.entity';
import { format } from 'date-fns';
import daLocale from 'date-fns/locale/da';

class MailController {
    private mailsEnabled: boolean;
    constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.mailsEnabled = process.env.SENDGRID_ENABLED === 'true'
    }

    private booking2templateData(booking: Booking) {
        const dateFormat = 'dd. MMM yyyy';
        const from = format(booking.from, dateFormat, { locale: daLocale });
        const to = format(booking.to, dateFormat, { locale: daLocale });
        return {
            from,
            to,
            pplCount: `${booking.pplCount}`,
            tubCount: `${booking.tubCount}`,
            comment: `${booking.comment}`
        }
    }

    private user2templateData(user: User) {
        return {
            fullName: `${user.fullName}`,
            email: user.email
        }
    }

    async sendReceipt(booking: Booking, user: User) {
        if (!this.mailsEnabled) {
            console.log('mails has been disabled');
            return;
        }

        try {
            const result = await sendgrid.send({
                to: user.email,
                from: process.env.SG_SENDER,
                templateId: process.env.SG_TEMPLATE_RECEIPT,
                dynamicTemplateData: {
                    ...this.booking2templateData(booking),
                    ...this.user2templateData(user)
                }
            })
        } catch (e) {
            console.log('could not send email', e.message);
        }
    }

}

export default new MailController();