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
    sendAdminNotification(booking: Booking, admin: User): Promise<void>
}

type SendOptions = {
    templateId: string,
    receiver: User,
    user?: User,
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

    private adminBookingsUrl() {
        return new URL("/#/admin/bookings", process.env.SG_WEBSITE_BASE_URL || 'http://localhost:3000').href;
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
            pplCount: `${booking.guests}`,
            tubCount: `${booking.tubCount}`,
            comment: `${booking.comment || ''}`,
            price: `${(booking.priceGuests || 0) + (booking.priceTub || 0)}`,
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

    private admin2templateData(user?: User) {
        if (!user) {
            return {};
        }
        return {
            adminFullname: `${user.fullName}`,
            adminEmail: user.email
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
        const templateId = "SG_TEMPLATE_RECEIPT";
        await this.send({ templateId, user, receiver: user, booking })
    }

    async sendAdminNotification(booking: Booking, admin: User) {
        const templateId = "SG_TEMPLATE_ADMIN_NOTIFICATION";
        await this.send({ templateId, receiver: admin, booking });
    }

    async sendConfirmation(booking: Booking, user: User, bankInfo: BankInformation) {
        const templateId = "SG_TEMPLATE_CONFIRMED";
        await this.send({ templateId, user, receiver: user, booking, bankInfo });
    }

    async sendRejection(booking: Booking, user: User) {
        const templateId = "SG_TEMPLATE_REJECTED";
        await this.send({ templateId, user, receiver: user, booking });
    }

    async sendResetPassword(user: User, token: string) {
        const templateId = "SG_TEMPLATE_RESET_PASSWORD";
        await this.send({ templateId, user, receiver: user, token, resetPasswordLink: process.env.RESET_PASSWORD_LINK });
    }

    private async send({ templateId, user, receiver, booking, bankInfo, token, resetPasswordLink }: SendOptions) {
        const template = process.env[templateId];
        if (!template) {
            console.log(`template missing for ${templateId}`);
            return;
        }
        if (!this.mailsEnabled) {
            console.log('mails has been disabled');
            return;
        }
        const sender = process.env.SG_SENDER
        if (!sender) {
            console.log('sender not specified. Cannot send email');
            return;
        }

        try {
            await sendgrid.send({
                to: receiver.email,
                from: sender,
                templateId: template,
                dynamicTemplateData: {
                    ...this.booking2templateData(booking),
                    ...this.user2templateData(user),
                    ...this.bank2tempalteData(bankInfo),
                    bookingsUrl: this.adminBookingsUrl(),
                    token: token,
                    resetPasswordLink: resetPasswordLink
                }
            })
        } catch (e) {
            console.log('could not send email', e.message, e);
        }
    }
}
