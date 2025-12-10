import { DataTable } from "@/app/components/DataTable/DataTable";
import useTicketsFiles from "./useTicketsFiles";

const TicketsFiles = () => {
  const { columns } = useTicketsFiles();
  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={true}
        tables={[
          {
            data: [],
            columns: columns,
            title: "Tickets",
            enableCollaps: true,
            enableSelection: true,
          },
        ]}
      />
      <p></p>
    </div>
  );
};

export default TicketsFiles;
