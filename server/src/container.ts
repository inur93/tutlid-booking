import { asClass, createContainer, InjectionMode } from 'awilix';
import AuthenticationController, { IAuthenticationController } from './controllers/AuthenticationController';
import BankInformationController, { IBankInformationController } from './controllers/BankInformationController';
import BookingController, { IBookingController } from './controllers/BookingController';
import MailController, { IMailController } from './controllers/MailController';
import PriceMatrixController, { IPriceMatrixController } from './controllers/PriceMatrixController';
import UserController, { IUserController } from './controllers/UserController';
import DbHandler, { IDbHandler } from './DbHandler';
import BankInformationRepository, { IBankInformationRepository } from './repositories/BankInformationRepository';
import BookingRepository, { IBookingRepository } from './repositories/BookingRepository';
import PriceMatrixRepository, { IPriceMatrixRepository } from './repositories/PriceMatrixRepository';
import UserRepository, { IUserRepository } from './repositories/UserRepository';
import AdminRoute from './routes/AdminRoute';
import AuthRoute from './routes/AuthRoute';
import BookingRoute from './routes/BookingRoute';
import PriceMatrixRoute from './routes/PriceMatrixRoute';
import UserRoute from './routes/UserRoute';

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
    mailController: IMailController

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
