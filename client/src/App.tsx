import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React, { createContext, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import api, { User } from './api';
import { Navigation } from './components/shared/Navigation';
import UserContext from './contexts/UserContext';
import { Routes } from './pages/Routes';

const theme = createMuiTheme({

});


function App() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.UserApi.self();
        setUser(response.body);
      } catch (e) { }
    }
    loadUser();
  }, [])
  return (
    <HashRouter>
      <UserContext.Provider value={[user, setUser]}>
        <MuiThemeProvider theme={theme}>
          <Navigation />
          <Routes />
        </MuiThemeProvider>
      </UserContext.Provider>
    </HashRouter>
  );
}

export default App;
