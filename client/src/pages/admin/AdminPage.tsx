import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api, { BookingStatus, Role, User, UserStatus } from '../../api';
import { BookingsIcon, FinanceIcon, UsersIcon } from '../../components/shared/Icons';
import Panel from '../../components/shared/Panel';
import ProtectedComponent from '../../components/shared/ProtectedComponent';
import { useBookings } from '../../hooks/useBookings';
import { useData } from '../../hooks/useData';
import { SlimPage } from '../shared/BasePage';
export default function AdminPage() {
    const { t } = useTranslation('app');
    const [{ bookings }] = useBookings(false, BookingStatus.reserved);
    const [{ data: users }] = useData<User[]>(() => api.AdminApi.getUsers(UserStatus.pendingApproval));
    const menus = [
        {
            to: '/admin/users',
            icon: <UsersIcon />,
            primary: t("app:adminPage.users"),
            secondary: t("app:adminPage.usersAction", { count: users?.length ?? 0 })
        },
        {
            to: '/admin/bookings',
            icon: <BookingsIcon />,
            primary: t("app:adminPage.bookings"),
            secondary: t("app:adminPage.bookingsAction", { count: bookings.length })
        },
        {
            to: '/admin/finances',
            icon: <FinanceIcon />,
            primary: t("app:adminPage.finances"),
            secondary: ''
        }
    ]
    return (
        <SlimPage>
            <ProtectedComponent requiredRoles={[Role.admin]}>
                <Panel>
                    <Typography variant='h1'>{t('app:adminPage.title')}</Typography>
                    <List>
                        {menus.map(({ to, icon, primary, secondary }) => (
                            <ListItem button component={Link} to={to}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {icon}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={primary} secondary={secondary} />
                                <ListItemSecondaryAction >
                                    <IconButton component={Link} to={to} >
                                        <ChevronRight />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>))}
                    </List>
                </Panel>
            </ProtectedComponent>
        </SlimPage>);
}
