import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { IRoute } from './interfaces/route.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    private app: Application;

    constructor(routes: IRoute[]) {
        this.app = express();
        console.log('environment', process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production') this.initializeStaticFolder();
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

    private initializeStaticFolder() {
        console.log('setting up public folder');
        this.app.use(express.static("public"));
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
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