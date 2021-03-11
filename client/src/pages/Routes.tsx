import { Route, Switch } from 'react-router-dom';
import AdminPage from './AdminPage';
import { Home } from './Home';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ResetPasswordPage } from './ResetPasswordPage';

export function Routes() {
    return (<Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/" component={Home} />
    </Switch>)
}