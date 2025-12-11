import { DataTable } from "@/app/components/DataTable/DataTable";
import useInvoicesFiles from "./useInvoicesFiles";

const InvoicesFiles = ({ forceVisible = false }) => {
  const { columns, rows } = useInvoicesFiles();

  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={false}
        tables={[
          {
            data: rows,
            columns: columns,
            title: "Facturas",
            enableCollaps: true,
            enableSelection: true,
          },
        ]}
      />
      <p></p>
    </div>
  );
};
export default InvoicesFiles;
