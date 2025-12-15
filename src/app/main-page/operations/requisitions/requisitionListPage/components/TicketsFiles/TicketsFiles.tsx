import { DataTable } from "@/app/components/DataTable/DataTable";
import useTicketsFiles from "./useTicketsFiles";

const TicketsFiles = () => {
  const { columns, rows } = useTicketsFiles();
  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={true}
        textSize= {{ mobile: "text-c3", desktop: "text-c2" }}
        tables={[
          {
            data: rows,
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
