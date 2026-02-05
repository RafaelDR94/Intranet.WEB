import InvoicesForm from "./components/InvoicesForm/InvoicesForm";
import TicketForm from "./components/TicketForm/TicketForm";
import { InvoicesProvider } from "./context/InvoicesContext";
const PersonalInvoicesInvoices = () => {
  return (
    <InvoicesProvider>
      <TicketForm
        responsiveLayoutMatrix={{
          sm: [[10], [10]],
          md: [[10], [10]],
          lg: [[10], [10]],
        }}
      />
      <InvoicesForm
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
          md: [
            [5, 5],
            [3.3, 3.3, 3.3],
            [2.5, 2.5, 2.5, 2.5],
          ],
          lg: [
            [5, 5],
            [3.3, 3.3, 3.3],
            [2.5, 2.5, 2.5, 2.5],
          ],
        }}
      />
    </InvoicesProvider>
  );
};

export default PersonalInvoicesInvoices;
