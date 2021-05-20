import { match } from 'react-router-dom';
import { UserDetails } from '../../components/admin/user/UserDetails';
import { BasePage } from '../BasePage';

type Props = {
    match: match<{ id: string }>
}
export function UserDetailsPage({ match }: Props) {
    return (<BasePage>
            <UserDetails userId={match.params.id} />
    </BasePage>)
}