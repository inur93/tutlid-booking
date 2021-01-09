import {
    bool,
    cleanEnv, email, port, str,
} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_URI: str(),
        SENDGRID_ENABLED: bool(),
        SENDGRID_API_KEY: str(),
        SG_SENDER: email(),
        SG_TEMPLATE_RECEIPT: str(),
        PORT: port(),
        DEFAULT_ADMIN_EMAIL: email(),
        DEFAULT_ADMIN_NAME: str(),
        DEFAULT_ADMIN_PASSWORD: str(),

    });
}

export default validateEnv;