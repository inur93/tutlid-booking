import { Button, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api, { Role, User, UserStatus } from '../../api';
import NewUserList from '../../components/admin/user/NewUserList';
import UserList from '../../components/admin/user/UserList';
import { ButtonContainer } from '../../components/shared/ButtonContainer';
import Panel from '../../components/shared/Panel';
import ProtectedComponent from '../../components/shared/ProtectedComponent';
import { useData } from '../../hooks/useData';
import { SlimPage } from '../BasePage';

export function UsersPage() {
    const { t } = useTranslation(['app', 'common']);

    const [{ data: newUsers, loading: newUsersloading }, reloadNewUsers] = useData<User[]>(() => api.AdminApi.getUsers(UserStatus.pendingApproval));
    const [{ data: users, loading }] = useData<User[]>(() => api.AdminApi.getUsers(UserStatus.approved));
    const updateStatus = async (id: string, status: UserStatus) => {
        await api.AdminApi.changeUserStatus(id, status);
        await reloadNewUsers();
    }
    const showNewUsers = !!(newUsers && newUsers.length && !newUsersloading);
    return (<SlimPage>
        <ProtectedComponent requiredRoles={[Role.admin]}>
            <Panel>
                {showNewUsers &&
                    <Grid>
                        <Typography variant='h2'>{t('app:newUserPanel.header')}</Typography>
                        <NewUserList users={newUsers || []} changeStatus={updateStatus} />
                    </Grid>}
                {!loading &&
                    <Grid>
                        <Typography variant='h2'>{t('app:usersPage.usersHeader')}</Typography>
                        <UserList users={users || []} />
                    </Grid>}
                <ButtonContainer left>
                    <Button color='primary' component={Link} to='/admin'>{t('common:button.back')}</Button>
                </ButtonContainer>
            </Panel>
        </ProtectedComponent>
    </SlimPage>)
}