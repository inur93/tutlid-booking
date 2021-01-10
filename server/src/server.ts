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

validateEnv();
async function setupDefaultAdmin() {
    const admin = await UserModel.findOne({
        roles: UserRole.admin
    }).exec();
    if (!admin) {
        console.log('creating default admin');
        UserModel.create({
            email: process.env.DEFAULT_ADMIN_EMAIL,
            fullName: process.env.DEFAULT_ADMIN_NAME,
            roles: [UserRole.read, UserRole.basic, UserRole.admin],
            status: UserStatus.approved,
            password: await hashPassword(process.env.DEFAULT_ADMIN_PASSWORD)
        })
    }

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
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new AuthRoute(),
            new UserRoute(),
            new BookingRoute(),
            new AdminRoute()
        ],
    );
    app.listen();
})();