import MongoMemoryServer from "mongodb-memory-server-core";
import Container, { IContainer } from "../container";
import DbHandler, { IDbHandler } from "../DbHandler";


export type SetupData = {
    container: IContainer,
    dbHandler: IDbHandler,
    mongo: MongoMemoryServer,
    teardown: () => Promise<void>
}

export async function setupTest(): Promise<SetupData> {

    const mongo = new MongoMemoryServer({
        binary: {
            version: '4.0.14'
        }
    });

    await mongo.start();
    const uri = mongo.getUri();
    const dbName = mongo.instanceInfo?.dbName || '';
    const dbHandler = new DbHandler();
    await dbHandler.connect({ dbName, uri, ssl: false });

    const teardown = async () => {
        await dbHandler?.disconnect();
        await mongo?.stop();
    }
    return {
        container: Container,
        dbHandler,
        mongo,
        teardown
    };
}
