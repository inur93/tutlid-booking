import { Route, Switch } from 'react-router-dom';
import AdminPage from './admin/AdminPage';
import BookingsPage from './admin/BookingsPage';
import { FinancePage } from './admin/FinancePage';
import { UserDetailsPage } from './admin/UserDetailsPage';
import { UsersPage } from './admin/UsersPage';
import { LoginPage } from './auth/LoginPage';
import { LogoutPage } from './auth/LogoutPage';
import { ResetPasswordPage } from './auth/ResetPasswordPage';
import { CreateBookingPage } from './bookings/CreateBookingPage';
import { CalendarPage } from './CalendarPage';
import { GalleryPage } from './GalleryPage';
import { HomePage } from './HomePage';
import { RegisterPage } from './RegisterPage';

export function Routes() {
    return (<Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/logout" component={LogoutPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/bookings/create" component={CreateBookingPage} />
        <Route path="/admin/users/:id" component={UserDetailsPage} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/bookings" component={BookingsPage} />
        <Route path="/admin/finances" component={FinancePage} />
        <Route path='/admin' component={AdminPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/" component={HomePage} />
    </Switch>)
}