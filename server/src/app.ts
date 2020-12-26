import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { IRoute } from './interfaces/route.interface';
import errorMiddleware from './middleware/error.middleware';
import cors from 'cors';

class App {
    private app: Application;

    constructor(routes: IRoute[]) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: 'http://localhost:3000' //process.env.ALLOWED_ORIGIN || '*',
        }))
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeRoutes(routes: IRoute[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
    }
}

export default App;