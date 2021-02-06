import { asClass, createContainer, InjectionMode } from 'awilix';
import AuthenticationController, { IAuthenticationController } from './controllers/authentication.controller';
import BankInformationController, { IBankInformationController } from './controllers/bankinformation.controller';
import BookingController, { IBookingController } from './controllers/booking.controller';
import MailController from './controllers/mail.controller';
import PriceMatrixController, { IPriceMatrixController } from './controllers/pricematrix.controller';
import UserController, { IUserController } from './controllers/user.controller';
import DbHandler, { IDbHandler } from './DbHandler';
import BankInformationRepository, { IBankInformationRepository } from './repositories/bankinformation.repo';
import BookingRepository, { IBookingRepository } from './repositories/booking.repo';
import PriceMatrixRepository, { IPriceMatrixRepository } from './repositories/pricematrix.repo';
import UserRepository, { IUserRepository } from './repositories/user.repo';
import AdminRoute from './routes/admin.route';
import AuthRoute from './routes/auth.route';
import BookingRoute from './routes/booking.route';
import PriceMatrixRoute from './routes/pricematrix.route';
import UserRoute from './routes/user.route';

export interface IContainer {
    dbHandler: IDbHandler
    userRepository: IUserRepository
    bookingRepository: IBookingRepository
    priceMatrixRepository: IPriceMatrixRepository
    bankInformationRepository: IBankInformationRepository

    userController: IUserController
    bookingController: IBookingController
    priceMatrixController: IPriceMatrixController
    bankInformationController: IBankInformationController
    mailController: MailController

    authenticationController: IAuthenticationController

    //routes
    adminRoute: AdminRoute,
    authRoute: AuthRoute,
    bookingRoute: BookingRoute,
    priceMatrixRoute: PriceMatrixRoute,
    userRoute: UserRoute
}

const container = createContainer<IContainer>({
    injectionMode: InjectionMode.PROXY
})

container.register({
    //routes
    adminRoute: asClass(AdminRoute),
    userRoute: asClass(UserRoute),
    authRoute: asClass(AuthRoute),
    bookingRoute: asClass(BookingRoute),
    priceMatrixRoute: asClass(PriceMatrixRoute),

    //repos
    bankInformationRepository: asClass(BankInformationRepository),
    bookingRepository: asClass(BookingRepository),
    priceMatrixRepository: asClass(PriceMatrixRepository),
    userRepository: asClass(UserRepository),

    //controllers
    authenticationController: asClass(AuthenticationController),
    bankInformationController: asClass(BankInformationController),
    bookingController: asClass(BookingController),
    mailController: asClass(MailController).singleton(),
    priceMatrixController: asClass(PriceMatrixController),
    userController: asClass(UserController),

    //misc
    dbHandler: asClass(DbHandler).singleton(),

})

export default container.cradle;
