import {
    cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_HOST: str(),
        MONGO_PORT: port(),
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_DB: str(),
        PORT: port(),
    });
}

export default validateEnv;