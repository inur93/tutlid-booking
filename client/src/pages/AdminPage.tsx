import { Badge, Grid, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { BookingStatus, Role, UserStatus } from '../api';
import AccountPanel from '../components/admin/AccountPanel';
import NewUserPanel from '../components/admin/NewUserPanel';
import PendingBookingsPanel from '../components/admin/PendingBookingsPanel';
import AccessDenied from '../components/shared/AccessDenied';
import { useAuthUser } from '../hooks/useAuthUser';
import { useBookings } from '../hooks/useBookings';
import { useUsers } from '../hooks/useUsers';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
        marginTop: theme.spacing(2),
        '& .MuiCard-root': {
            marginBottom: theme.spacing(2)
        },
        '& div[role="tabpanel"]': {
            width: '100%'
        }
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },

}));
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}>
            {value === index && (children)}
        </div>
    );
}

type AdminPageProps = {}
export default function AdminPage({ }: AdminPageProps) {
    const classes = useStyles();
    const [user] = useAuthUser();
    const { t } = useTranslation('app');
    const [page, setPage] = useState(0);
    const [{ users }, changeUserStatus] = useUsers(UserStatus.pendingApproval);
    const [{ bookings }, { load: loadBookings }] = useBookings(false, BookingStatus.reserved);

    const changeBookingStatus = async (id: string, status: BookingStatus, messageFromAdmin?: string) => {
        await api.AdminApi.changeBookingStatus(id, {
            status, messageFromAdmin
        });
        await loadBookings();
    }

    if (!user.hasRole(Role.admin)) return <AccessDenied requiredRoles={[Role.admin]} />;

    return (<Grid container justify='center'>
        <Grid className={classes.root} item xs={12} md={8} lg={6}>
            <Tabs orientation='vertical'
                aria-label='Admin panels'
                className={classes.tabs}
                value={page}
                onChange={(e, v) => setPage(v)}
            >
                <Tab label={t('app:adminPage.usersTabLabel')} icon={<Badge badgeContent={users.length} color="primary"><PeopleIcon /></Badge>} id='0' />
                <Tab label={t('app:adminPage.bookingsTabLabel')} icon={<Badge badgeContent={bookings.length} color="primary"><EventIcon /></Badge>} id='1' />
                <Tab label={t('app:adminPage.accountTabLabel')} icon={<AccountBalanceIcon />} id='2' />
            </Tabs>
            <TabPanel index={page} value={0}>
                <NewUserPanel users={users} changeStatus={changeUserStatus} />
            </TabPanel>
            <TabPanel index={page} value={1}>
                <PendingBookingsPanel bookings={bookings} changeStatus={changeBookingStatus} />
            </TabPanel>
            <TabPanel index={page} value={2}>
                <AccountPanel />
            </TabPanel>
        </Grid>
    </Grid>);
}