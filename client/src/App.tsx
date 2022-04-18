import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useEffect, useRef, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import api from './api';
import { Navigation } from './components/navigation/Navigation';
import UserContext, { AuthUser } from './contexts/UserContext';
import Routes from './pages/Routes';
import { StyledEngineProvider } from '@mui/material/styles';
const theme = createTheme({
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 400
    },
    h2: {
      fontSize: '1.75rem'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '0.75rem'
        }
      }

    },
    MuiCssBaseline: {
      styleOverrides: {
        'html': {
          a: {
            color: green[600],
            'textDecoration': 'none'
          },
        }
      }
    }
  },

  palette: {
    primary: {
      main: green[600],
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
      <StyledEngineProvider injectFirst>
        <UserContext.Provider value={[user, setUser]}>
          <ThemeProvider theme={theme}>
            <CssBaseline >
              <Navigation />
              <Routes />
            </CssBaseline>
          </ThemeProvider>
        </UserContext.Provider>
      </StyledEngineProvider>
    </HashRouter>
  );
}

export default App;
