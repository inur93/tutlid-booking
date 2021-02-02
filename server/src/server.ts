
import App from "./app";
import container from "./container";
import validateEnv from "./utils/validateEnv";

validateEnv();

(async () => {
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