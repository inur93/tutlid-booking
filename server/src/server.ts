
import { startOfToday } from "date-fns";
import App from "./app";
import container from "./container";
import BankInformationModel from "./models/bankinformation/BankInformation";
import UserModel from "./models/user/User";
import { UserRole } from "./models/user/UserRole";
import { UserStatus } from "./models/user/UserStatus";
import { isProduction } from "./utils/environment";
import { hashPassword } from "./utils/security";
import validateEnv from "./utils/validateEnv";

validateEnv();

(async () => {
    await container.dbHandler.connect({
        uri: process.env.MONGO_URI || 'invalid',
        dbName: 'tutlid',
        ssl: isProduction()
    });

    const setup = new DbSetup();
    await setup.setupDefaultAdmin();
    await setup.setupDefaultBankInformation();

    const app = new App(
        [
            container.authRoute,
            container.adminRoute,
            container.userRoute,
            container.bookingRoute,
            container.adminRoute
        ],
    );

    app.listen();
})();


class DbSetup {
    async setupDefaultAdmin() {
        const admin = await UserModel.findOne({
            roles: UserRole.admin
        }).exec();
        if (admin) {
            return
        }
        console.log('creating default admin');
        UserModel.create({
            email: process.env.DEFAULT_ADMIN_EMAIL,
            fullName: process.env.DEFAULT_ADMIN_NAME,
            roles: [UserRole.read, UserRole.basic, UserRole.admin],
            status: UserStatus.approved,
            password: await hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || 'supersecret')
        })
    }

    async setupDefaultBankInformation() {
        const existing = await BankInformationModel.findOne({}).exec();
        if (existing) {
            return
        }
        BankInformationModel.create({
            regNo: '1234',
            accountNo: '1234567890'
        })
    }
}