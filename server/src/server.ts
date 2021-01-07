import { connect } from 'mongoose';
import App from "./app";
import AuthRoute from './routes/auth.route';
import BookingRoute from "./routes/booking.route";
import UserRoute from "./routes/user.route";
import validateEnv from "./utils/validateEnv";

validateEnv();

(async () => {
    try {
        await connect(process.env.MONGO_URI, {
            ssl: true,
            dbName: 'tutlid',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new AuthRoute(),
            new UserRoute(),
            new BookingRoute()
        ],
    );
    app.listen();
})();