import { Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

export function Routes() {

    return (<Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/" component={Home} />
    </Switch>)
}