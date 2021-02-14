import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { IRoute } from './interfaces/route.interface';
import errorMiddleware from './middleware/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { isProduction } from './utils/environment';

class App {
    private readonly app: Application;

    constructor(routes: IRoute[]) {
        this.app = express();
        console.log('environment', process.env.NODE_ENV);
        if (isProduction()) {
            this.initializeStaticFolder();
        }
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
        this.initializeSwagger();
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

    private initializeSwagger() {
        const spec = swaggerJsDoc({
            swaggerDefinition: {
                info: {
                    title: "Tutlið booking API",
                    version: "1.0.0"
                }
            },
            apis: ['.routes/*.route.ts']

        })
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
    }
}

export default App;
