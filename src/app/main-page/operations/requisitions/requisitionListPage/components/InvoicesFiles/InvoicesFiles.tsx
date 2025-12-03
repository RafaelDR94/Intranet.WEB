import { DataTable } from "@/app/components/DataTable/DataTable";

const InvoicesFiles = ({ forceVisible = false }) => {
  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={true}
        tables={[
          {
            data: [],
            columns: [],
            title: 'Facturas',
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
