import { DataTable } from "@/app/components/DataTable/DataTable";

const TicketsFiles = () => {
  return (
    <div>
      <DataTable 
        showCalendar={true}
        showDownloadTable={true}
        tables={[
          {
            data: [],
            columns: [],
            title: 'Tickets',
            enableCollaps: true,
            enableSelection: true,
          }
        ]}
      />
      <p></p>
    </div>
  );
};

export default TicketsFiles;
