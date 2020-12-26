import App from "./app";
import config from "./config/ormconfig";
import AuthRoute from './routes/auth.route';
import UserRoute from "./routes/user.route";
import validateEnv from "./utils/validateEnv";
import { connect } from 'mongoose';
import BookingRoute from "./routes/booking.route";

validateEnv();

(async () => {
    try {
        console.log('connecting to database...', process.env.MONGO_URI);
        await connect(process.env.MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
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