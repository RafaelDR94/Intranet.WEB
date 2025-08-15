import InvoicesForm from "./components/InvoicesForm/InvoicesForm";
import TicketForm from "./components/TicketForm/TicketForm";
import { InvoicesProvider } from "./context/InvoicesContext";

const PersonalInvoicesInvoices = () => {
    return (
        <InvoicesProvider>
            <TicketForm layoutMatrix={[[10], [10], [5]]} type="create"/>
            <InvoicesForm layoutMatrix={[[10], [10], [5, 5]]} type="update"/>
        </InvoicesProvider>);
}

export default PersonalInvoicesInvoices;
