import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, { useEffect, useRef, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import api from './api';
import { Navigation } from './components/navigation/Navigation';
import UserContext, { AuthUser } from './contexts/UserContext';
import { Routes } from './pages/Routes';

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 400
    },
    h2: {
      fontSize: '1.75rem'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        a: {
          color: green[500],
          'text-decoration': 'none'
        }
      }
    }
  },
  palette: {
    primary: {
      main: green[500],
      contrastText: "#fff"
    }
  }
});

function App() {
  const [user, setUser] = useState<AuthUser>(new AuthUser());
  const handle = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.UserApi.self();
        setUser(new AuthUser(response.body));
      } catch (e) {
        setUser(new AuthUser());
      }
    }
    loadUser();
    handle.current = setInterval(loadUser, 1000 * 60 * 5);
    return () => handle.current && clearInterval(handle.current);
  }, [])
  return (
    <HashRouter>
      <UserContext.Provider value={[user, setUser]}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />
          <Routes />
        </MuiThemeProvider>
      </UserContext.Provider>
    </HashRouter>
  );
}

export default App;
