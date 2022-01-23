import MongoMemoryServer from "mongodb-memory-server-core";
import ActualContainer, { IContainer } from '../src/container';
import DbHandler, { IDbHandler } from "../src/DbHandler";

export type SetupData = {
    container: IContainer,
    dbHandler: IDbHandler,
    mongo: MongoMemoryServer
}

export async function setupTest(): Promise<SetupData> {

    const mongo = new MongoMemoryServer({
        binary: {
            version: '4.0.14'
        }
    });

    await mongo.start();
    const uri = await mongo.getUri();

    const dbHandler = new DbHandler();
    await dbHandler.connect({
        uri,
        ssl: false
    });

    return {
        container: ActualContainer,
        dbHandler,
        mongo
    };
}
