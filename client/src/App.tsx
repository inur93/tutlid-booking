import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React from 'react';
import { I18nContext } from 'react-i18next';
import { HashRouter } from 'react-router-dom';
import { AdminApi } from './api/adminApi';
import { AuthApi } from './api/authApi';
import { BookingApi } from './api/bookingApi';
import { PriceMatrixApi } from './api/priceMatrixApi';
import { UserApi } from './api/userApi';
import { TopBar } from './components/navigation/TopBar';
import i18n from './i18n';
import { ContainerContext, DiContext } from './ioc';
import { Routes } from './pages/Routes';
import { AuthStore } from './stores/AuthStore';
import { LocaleStore } from './stores/LocaleStore';
import { UnitListStore } from './stores/UnitListStore';
import { UnitStore } from './stores/UnitStore';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
      contrastText: "#fff"
    }
  }
});
const adminApi = new AdminApi();
const authApi = new AuthApi();
const bookingApi = new BookingApi();
const priceMatrixApi = new PriceMatrixApi();
const userApi = new UserApi();
const authStore = new AuthStore(authApi, userApi);
const localStore = new LocaleStore();
const unitListStore = new UnitListStore(adminApi);
const unitStore = new UnitStore(adminApi, unitListStore);

const container: ContainerContext = {
  adminApi,
  authApi,
  bookingApi,
  priceMatrixApi,
  userApi,
  authStore,
  localStore,
  unitStore,
  unitListStore
}

function App() {
  return (
    <HashRouter>
      <DiContext.Provider value={container}>
        <I18nContext.Provider value={{ i18n }}>
          <MuiThemeProvider theme={theme}>
            <TopBar />
            <Routes />
          </MuiThemeProvider>
        </I18nContext.Provider>
      </DiContext.Provider>
    </HashRouter>
  );
}

export default App;
