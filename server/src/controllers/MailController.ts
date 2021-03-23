import sendgrid from '@sendgrid/mail';
import { format } from 'date-fns';
import daLocale from 'date-fns/locale/da';
import { BankInformation } from '../models/bankinformation/BankInformationModels';
import { Booking } from '../models/booking/BookingModels';
import { User } from '../models/user/UserModels';

export interface IMailController {
    sendReceipt(booking: Booking, user: User): Promise<void>
    sendConfirmation(booking: Booking, user: User, bankInfo: BankInformation): Promise<void>
    sendRejection(booking: Booking, user: User): Promise<void>
    sendResetPassword(user: User, token: string): Promise<void>
}

type SendOptions = {
    templateId: string,
    user: User,
    booking?: Booking,
    bankInfo?: BankInformation,
    token?: string,
    resetPasswordLink?: string
}
export default class MailController implements IMailController {
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
        const templateId = process.env.SG_TEMPLATE_RECEIPT;
        if (!templateId) {
            console.log('template id for receipt email is not specified');
            return;
        }
        await this.send({ templateId, user, booking })
    }

    async sendConfirmation(booking: Booking, user: User, bankInfo: BankInformation) {
        const templateId = process.env.SG_TEMPLATE_CONFIRMED;
        if (!templateId) {
            console.log('template id for confirmation email is not specified');
            return;
        }
        await this.send({ templateId, user, booking, bankInfo });
    }

    async sendRejection(booking: Booking, user: User) {
        const templateId = process.env.SG_TEMPLATE_REJECTED;
        if (!templateId) {
            console.log('template id for rejection email is not specified');
            return;
        }
        await this.send({ templateId, user, booking });
    }

    async sendResetPassword(user: User, token: string) {
        const templateId = process.env.SG_TEMPLATE_RESET_PASSWORD;
        if (!templateId) {
            console.log('template id for rejection email is not specified');
            return;
        }
        await this.send({ templateId, user, token, resetPasswordLink: process.env.RESET_PASSWORD_LINK });
    }

    private async send({ templateId, user, booking, bankInfo, token, resetPasswordLink }: SendOptions) {
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
                    ...this.bank2tempalteData(bankInfo),
                    token: token,
                    resetPasswordLink: resetPasswordLink
                }
            })
        } catch (e) {
            console.log('could not send email', e.message, e);
        }
    }
}
