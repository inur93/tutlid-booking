import sendgrid from '@sendgrid/mail';
import { format } from 'date-fns';
import daLocale from 'date-fns/locale/da';
import { BankInformation } from '../models/bankinformation/bankinformation.entity';
import { Booking } from '../models/booking/booking.entity';
import { User } from '../models/user/user.entity';

class MailController {
    private mailsEnabled: boolean;
    constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.mailsEnabled = process.env.SENDGRID_ENABLED === 'true'
    }

    private booking2templateData(booking?: Booking) {
        if(!booking) return {};
        const dateFormat = 'dd. MMM yyyy';
        const from = format(booking.from, dateFormat, { locale: daLocale });
        const to = format(booking.to, dateFormat, { locale: daLocale });
        return {
            from,
            to,
            period: `${from} - ${to}`,
            pplCount: `${booking.pplCount}`,
            tubCount: `${booking.tubCount}`,
            comment: `${booking.comment}`,
            price: `${(booking.pricePpl || 0)+(booking.priceTub || 0)}`,
            messageFromAdmin: `${booking.messageFromAdmin ? 'Besked fra udlåner:' : ''} ${booking.messageFromAdmin}`
        }
    }

    private user2templateData(user?: User) {
        if(!user) return {};
        return {
            fullName: `${user.fullName}`,
            email: user.email
        }
    }

    private bank2tempalteData(bankInfo?: BankInformation) {
        if(!bankInfo) return {};
        return {
            regNo: `${bankInfo.regNo}`,
            accountNo: `${bankInfo.accountNo}`
        }
    }

    async sendReceipt(booking: Booking, user: User) {
        await this.send(process.env.SG_TEMPLATE_RECEIPT, booking, user)
    }

    async sendConfirmation(booking: Booking, user: User, bankInfo: BankInformation) {
        this.send(process.env.SG_TEMPLATE_CONFIRMED, booking, user, bankInfo);
    }

    async sendRejection(booking: Booking, user: User) {
        this.send(process.env.SG_TEMPLATE_REJECTED, booking, user);
    }

    private async send(templateId: string, booking?: Booking, user?: User, bankInfo?: BankInformation) {
        if (!this.mailsEnabled) {
            console.log('mails has been disabled');
            return;
        }

        console.log('sending email', templateId, booking, user, bankInfo);
        try {
            const result = await sendgrid.send({
                to: user.email,
                from: process.env.SG_SENDER,
                templateId: templateId,
                dynamicTemplateData: {
                    ...this.booking2templateData(booking),
                    ...this.user2templateData(user),
                    ...this.bank2tempalteData(bankInfo)
                }
            })
        } catch (e) {
            console.log('could not send email', e.message);
        }
    }

}

export default new MailController();