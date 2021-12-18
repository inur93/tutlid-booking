import React, { useContext } from 'react';
import { AdminApi } from "./api/adminApi";
import { AuthApi } from './api/authApi';
import { BookingApi } from './api/bookingApi';
import { PriceMatrixApi } from './api/priceMatrixApi';
import { UserApi } from './api/userApi';
import { AuthStore } from './stores/AuthStore';
import { LocaleStore } from './stores/LocaleStore';
import { UnitListStore } from './stores/UnitListStore';
import { UnitStore } from './stores/UnitStore';

export interface ContainerContext {
    adminApi: AdminApi,
    authApi: AuthApi,
    bookingApi: BookingApi,
    priceMatrixApi: PriceMatrixApi,
    userApi: UserApi,
    authStore: AuthStore,
    localStore: LocaleStore,
    unitStore: UnitStore,
    unitListStore: UnitListStore
}
const DiContext = React.createContext<ContainerContext | null>(null);

function useContainer(): ContainerContext {
    const container = useContext(DiContext);
    if (!container) {
        throw new Error('The container should not be null');
    }
    return container;
}


export {
    useContainer,
    DiContext
};

