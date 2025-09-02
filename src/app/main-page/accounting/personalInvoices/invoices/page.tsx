import InvoicesForm from "./components/InvoicesForm/InvoicesForm";
import TicketForm from "./components/TicketForm/TicketForm";
import { InvoicesProvider } from "./context/InvoicesContext";

const PersonalInvoicesInvoices = () => {
    return (
        <InvoicesProvider>
            <TicketForm responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                md: [[5, 5], [5, 5], [2.5, 2.5, 5], [5, 5]],
                lg: [[5, 5], [3.3, 3.3, 3.3], [3, 3, 3]],
            }} />
            <InvoicesForm responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                md: [[5, 5], [5, 5], [2.5, 2.5, 5], [5, 5]],
                lg: [[5, 5], [3.3, 3.3, 3.3], [2, 2, 3, 3]],
            }} />
        </InvoicesProvider>);
}

export default PersonalInvoicesInvoices;
