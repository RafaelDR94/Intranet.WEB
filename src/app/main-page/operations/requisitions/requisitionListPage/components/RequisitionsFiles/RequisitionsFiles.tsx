import { DataTable } from "@/app/components/DataTable/DataTable";

const RequisitionsFiles = ({ forceVisible = false }) => {
  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={true}
        tables={[
          {
            data: [],
            columns: [],
            title: 'Requisiciones',
            enableCollaps: true,
            enableSelection: true,
          },
        ]}
      />
      <p></p>
    </div>
  );
};
export default RequisitionsFiles;
