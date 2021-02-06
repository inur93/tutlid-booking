import mongoose from 'mongoose';
import { isProduction } from './utils/environment';

export interface IDbHandler {
    connect(): Promise<void>
    disconnect(): Promise<void>
}
type MongoOptions = {
    uri: string,
    dbName: string,
    ssl: boolean
}
export default class DbHandler implements IDbHandler {

    options: MongoOptions;
    constructor(options: MongoOptions) {
        this.options = options || {
            uri: process.env.MONGO_URI,
            dbName: 'tutlid',
            ssl: isProduction()
        };
    }
    async connect(): Promise<void> {
        if (!this.options.uri) {
            console.error('Mongo URI is not set');
            return;
        }
        try {
            await mongoose.connect(this.options.uri, {
                ssl: this.options.ssl,
                dbName: this.options.dbName,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
        } catch (error) {
            console.log('Error while connecting to the database', error);
        }
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }

   
}
