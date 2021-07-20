import mongoose from 'mongoose';

export interface IDbHandler {
    connect(options: MongoOptions): Promise<void>
    disconnect(): Promise<void>
}
type MongoOptions = {
    uri: string,
    dbName: string,
    ssl: boolean
}
export default class DbHandler implements IDbHandler {

    async connect(options: MongoOptions): Promise<void> {

        if (!options.uri) {
            console.error('Mongo URI is not set');
            return;
        }

        try {
            // await mongoose.connect("", {
                
            // })
            await mongoose.connect(options.uri, {
                // ssl: options.ssl,
                dbName: options.dbName,
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
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
