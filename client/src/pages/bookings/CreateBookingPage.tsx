import { useHistory } from "react-router-dom";
import { Role } from "../../api";
import { CreateBooking } from "../../components/calendar/CreateBooking";
import Panel from "../../components/shared/Panel";
import ProtectedComponent from "../../components/shared/ProtectedComponent";
import { SlimPage } from "../shared/BasePage";

export function CreateBookingPage() {
    const router = useHistory();
    return <SlimPage>
        <ProtectedComponent requiredRoles={[Role.read]}>
            <Panel>
                <CreateBooking onClose={() => router.replace('/')} />
            </Panel>
        </ProtectedComponent>
    </SlimPage>
}