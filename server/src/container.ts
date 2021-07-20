import { asClass, createContainer, InjectionMode } from 'awilix';
import AuthenticationController, { IAuthenticationController } from './controllers/AuthenticationController';
import BankInformationController, { IBankInformationController } from './controllers/BankInformationController';
import BookingController, { IBookingController } from './controllers/BookingController';
import MailController, { IMailController } from './controllers/MailController';
import { IPriceController, PriceController } from './controllers/PriceController';
import UserController, { IUserController } from './controllers/UserController';
import DbHandler, { IDbHandler } from './DbHandler';
import BankInformationRepository, { IBankInformationRepository } from './repositories/BankInformationRepository';
import BookingRepository, { IBookingRepository } from './repositories/BookingRepository';
import { IPriceConfigurationRepository, PriceConfigurationRepository } from './repositories/PriceConfigurationRepository';
import UnitRepository, { IUnitRepository } from './repositories/UnitRepository';
import UserRepository, { IUserRepository } from './repositories/UserRepository';
import AdminRoute from './routes/AdminRoute';
import AuthRoute from './routes/AuthRoute';
import BookingRoute from './routes/BookingRoute';
import UserRoute from './routes/UserRoute';

export interface IContainer {
    dbHandler: IDbHandler
    userRepository: IUserRepository
    bookingRepository: IBookingRepository
    bankInformationRepository: IBankInformationRepository
    unitRepository: IUnitRepository
    priceConfigurationRepository: IPriceConfigurationRepository

    userController: IUserController
    bookingController: IBookingController
    priceController: IPriceController,
    bankInformationController: IBankInformationController
    mailController: IMailController

    authenticationController: IAuthenticationController

    //routes
    adminRoute: AdminRoute,
    authRoute: AuthRoute,
    bookingRoute: BookingRoute,
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

    //repos
    bankInformationRepository: asClass(BankInformationRepository),
    bookingRepository: asClass(BookingRepository),
    userRepository: asClass(UserRepository),
    unitRepository: asClass(UnitRepository),
    priceConfigurationRepository: asClass(PriceConfigurationRepository),

    //controllers
    authenticationController: asClass(AuthenticationController),
    bankInformationController: asClass(BankInformationController),
    bookingController: asClass(BookingController),
    mailController: asClass(MailController).singleton(),
    priceController: asClass(PriceController),
    userController: asClass(UserController),

    //misc
    dbHandler: asClass(DbHandler).singleton(),

})

export default container.cradle;
