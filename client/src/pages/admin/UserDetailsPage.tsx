import { match } from 'react-router-dom';
import { UserDetails } from '../../components/admin/user/UserDetails';
import { SlimPage } from '../BasePage';

type Props = {
    match: match<{ id: string }>
}
export function UserDetailsPage({ match }: Props) {
    return (<SlimPage>
        <UserDetails userId={match.params.id} />
    </SlimPage>)
}