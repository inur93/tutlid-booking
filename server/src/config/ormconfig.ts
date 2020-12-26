import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'mongodb',
    useUnifiedTopology: true,
    host: process.env.MONGO_HOST,
    port: Number(process.env.MONGO_PORT),
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DB,
    entities: [
        '/server/src/**/*.entity{.ts,.js}',
    ],
    migrations: [
        '/server/src/migrations/*.ts',
    ],
    cli: {
        migrationsDir: 'src/migrations',
    },
};

export = config;