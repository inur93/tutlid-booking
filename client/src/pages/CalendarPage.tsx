import { Role } from "../api";
import { BookingCalendar } from "../components/calendar/BookingCalendar";
import ProtectedComponent from "../components/shared/ProtectedComponent";
import { UltraWidePage } from "./shared/BasePage";

export function CalendarPage() {
    return <UltraWidePage>
        <ProtectedComponent requiredRoles={[Role.read]} >
            <BookingCalendar />
        </ProtectedComponent>
    </UltraWidePage>
}