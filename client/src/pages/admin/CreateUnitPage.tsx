import { match, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CreateUnitForm } from '../../components/admin/unit/CreateUnitForm';
import { UnitUiStore } from '../../components/admin/unit/UnitUiStore';
import { useContainer } from '../../ioc';
import { BasePage } from '../BasePage';
import { Alert } from '../../components/shared/Alert';
import { observer } from 'mobx-react-lite';

type Props = {
    match: match<{ id: string }>
}
const CreateUnitPage = observer(({ match, ...others }: Props) => {

    const history = useHistory();
    const container = useContainer();
    const [vm] = useState(() => new UnitUiStore(container.unitStore, container.unitListStore))

    useEffect(() => {
        vm.id = match.params.id;
        vm.history = history;
    }, [match.params.id, history])

    return (<BasePage>
        <Alert show={!!vm.error} severity="error">
            {vm.error}
        </Alert>
        <CreateUnitForm vm={vm} />
    </BasePage>)
})

export default CreateUnitPage;