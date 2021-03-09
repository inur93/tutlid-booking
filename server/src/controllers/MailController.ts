import sendgrid from '@sendgrid/mail';
import { format } from 'date-fns';
import daLocale from 'date-fns/locale/da';
import { BankInformation } from '../models/bankinformation/BankInformationModels';
import { Booking } from '../models/booking/BookingModels';
import { User } from '../models/user/UserModels';

export default class MailController {
    private readonly mailsEnabled: boolean;
    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY
        if (apiKey) {
            sendgrid.setApiKey(apiKey);
            this.mailsEnabled = process.env.SENDGRID_ENABLED === 'true'
        } else {
            this.mailsEnabled = false;
            console.log('mail is disabled');
        }
    }

    private booking2templateData(booking?: Booking) {
        if (!booking) {
            return {};
        }
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
            price: `${(booking.pricePpl || 0) + (booking.priceTub || 0)}`,
            messageFromAdmin: `${booking.messageFromAdmin ? 'Besked fra udlåner:' : ''} ${booking.messageFromAdmin}`
        }
    }

    private user2templateData(user?: User) {
        if (!user) {
            return {};
        }
        return {
            fullName: `${user.fullName}`,
            email: user.email
        }
    }

    private bank2tempalteData(bankInfo?: BankInformation) {
        if (!bankInfo) {
            return {};
        }
        return {
            regNo: `${bankInfo.regNo}`,
            accountNo: `${bankInfo.accountNo}`
        }
    }

    async sendReceipt(booking: Booking, user: User) {
        const template = process.env.SG_TEMPLATE_RECEIPT;
        if (!template) {
            console.log('template id for receipt email is not specified');
            return;
        }
        await this.send(template, user, booking)
    }

    async sendConfirmation(booking: Booking, user: User, bankInfo: BankInformation) {
        const template = process.env.SG_TEMPLATE_CONFIRMED;
        if (!template) {
            console.log('template id for confirmation email is not specified');
            return;
        }
        this.send(template, user, booking, bankInfo);
    }

    async sendRejection(booking: Booking, user: User) {
        const template = process.env.SG_TEMPLATE_REJECTED;
        if (!template) {
            console.log('template id for rejection email is not specified');
            return;
        }
        this.send(template, user, booking);
    }

    private async send(templateId: string, user: User, booking?: Booking, bankInfo?: BankInformation) {
        if (!this.mailsEnabled) {
            console.log('mails has been disabled');
            return;
        }
        const sender = process.env.SG_SENDER
        if (!sender) {
            console.log('sender not specified. Cannot send email');
            return;
        }

        console.log('sending email', templateId, booking, user, bankInfo);
        try {
            await sendgrid.send({
                to: user.email,
                from: sender,
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
