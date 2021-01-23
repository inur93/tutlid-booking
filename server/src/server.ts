import { connect } from 'mongoose';
import App from "./app";
import { UserModel, UserRole, UserStatus } from './models/user/user.entity';
import AuthRoute from './routes/auth.route';
import BookingRoute from "./routes/booking.route";
import UserRoute from "./routes/user.route";
import { hashPassword } from './utils/security';
import validateEnv from "./utils/validateEnv";
import { isProduction } from './utils/environment';
import AdminRoute from './routes/admin.route';
import { PriceMatrixModel } from './models/pricematrix/pricematrix.entity';
import { startOfToday } from 'date-fns';
import PriceMatrixRoute from './routes/pricematrix.route';
import { BankInformationModel } from './models/bankinformation/bankinformation.entity';

validateEnv();
async function setupDefaultAdmin() {
    const admin = await UserModel.findOne({
        roles: UserRole.admin
    }).exec();
    if (admin) return;
    console.log('creating default admin');
    UserModel.create({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        fullName: process.env.DEFAULT_ADMIN_NAME,
        roles: [UserRole.read, UserRole.basic, UserRole.admin],
        status: UserStatus.approved,
        password: await hashPassword(process.env.DEFAULT_ADMIN_PASSWORD)
    })
}

async function setupDefaultPriceMatrix() {
    const existing = await PriceMatrixModel.findOne({}).exec();
    if (existing) return;
    PriceMatrixModel.create({
        validFrom: startOfToday(),
        price: 350,
        tubPrice: 50
    })
}

async function setupDefaultBankInformation() {
    const existing = await BankInformationModel.findOne({}).exec();
    if (existing) return;
    BankInformationModel.create({
        regNo: '1234',
        accountNo: '1234567890'
    })
}
(async () => {
    try {
        await connect(process.env.MONGO_URI, {
            ssl: isProduction(),
            dbName: 'tutlid',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('connected to database!');
        setupDefaultAdmin();
        setupDefaultPriceMatrix();
        setupDefaultBankInformation();
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new AuthRoute(),
            new UserRoute(),
            new BookingRoute(),
            new AdminRoute(),
            new PriceMatrixRoute()
        ],
    );
    app.listen();
})();