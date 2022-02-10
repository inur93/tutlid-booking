import { useNavigate } from "react-router-dom";
import { Role } from "../../api";
import { CreateBooking } from "../../components/calendar/CreateBooking";
import Panel from "../../components/shared/Panel";
import ProtectedComponent from "../../components/shared/ProtectedComponent";
import { SlimPage } from "../shared/BasePage";

export function CreateBookingPage() {
    const navigate = useNavigate();
    return <SlimPage>
        <ProtectedComponent requiredRoles={[Role.read]}>
            <Panel>
                <CreateBooking onClose={() => navigate('/')} />
            </Panel>
        </ProtectedComponent>
    </SlimPage>
}