import { Route, Switch } from 'react-router-dom';
import { Gallery } from '../components/gallery/Gallery';
import BookingsPage from './admin/BookingsPage';
import { FinancePage } from './admin/FinancePage';
import { UserDetailsPage } from './admin/UserDetailsPage';
import { UsersPage } from './admin/UsersPage';
import { HomePage } from './shared/HomePage';
import { LoginPage } from './shared/LoginPage';
import { RegisterPage } from './shared/RegisterPage';
import { ResetPasswordPage } from './shared/ResetPasswordPage';

export function Routes() {
    return (<Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin/users/:id" component={UserDetailsPage} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/bookings" component={BookingsPage} />
        <Route path="/admin/finances" component={FinancePage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/" component={HomePage} />

    </Switch>)
}