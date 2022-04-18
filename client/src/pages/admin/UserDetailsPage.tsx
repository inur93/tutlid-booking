import { useParams } from 'react-router-dom';
import { UserDetails } from '../../components/admin/user/UserDetails';
import { SlimPage } from '../shared/BasePage';


export function UserDetailsPage() {
    const params = useParams<{ id: string }>();
    if (!params.id) {
        return null;
    }
    return (<SlimPage>
        <UserDetails userId={params.id} />
    </SlimPage>)
}