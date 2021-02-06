
import { startOfToday } from "date-fns";
import App from "./app";
import container from "./container";
import { BankInformationModel } from "./models/bankinformation/bankinformation.entity";
import { PriceMatrixModel } from "./models/pricematrix/pricematrix.entity";
import { UserModel, UserRole, UserStatus } from "./models/user/user.entity";
import { hashPassword } from "./utils/security";
import validateEnv from "./utils/validateEnv";

validateEnv();


(async () => {
    await container.dbHandler.connect();

    const setup = new DbSetup();
    await setup.setupDefaultAdmin();
    await setup.setupDefaultBankInformation();
    await setup.setupDefaultPriceMatrix();

    const app = new App(
        [
            container.adminRoute,
            container.userRoute,
            container.bookingRoute,
            container.adminRoute,
            container.priceMatrixRoute
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

    async setupDefaultPriceMatrix() {
        const existing = await PriceMatrixModel.findOne({}).exec();
        if (existing) {
            return
        }
        PriceMatrixModel.create({
            validFrom: startOfToday(),
            price: 350,
            tubPrice: 50
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