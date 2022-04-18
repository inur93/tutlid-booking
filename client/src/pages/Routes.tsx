import { Route, Routes } from 'react-router-dom';
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

export default function () {
    return (<Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/bookings/create" element={<CreateBookingPage />} />
        <Route path="/admin/users/:id" element={<UserDetailsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/bookings" element={<BookingsPage />} />
        <Route path="/admin/finances" element={<FinancePage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/" element={<HomePage />} />
    </Routes>)
}