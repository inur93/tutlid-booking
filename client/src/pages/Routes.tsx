import { Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { LoginPage } from './LoginPage';

export function Routes() {

    return (<Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={Home} />
    </Switch>)
}