// import { Checkbox } from "../CheckBox/CheckBox";

// Typescript interfaces

type Column = { key: string; label: string };
type Row = { id: any };
type DataTableProps = {
  columns: Column[];
  data: any[];
  onSelectAll: () => void;
  onSelectRow: (id: Row["id"]) => void;
  selectedRows: Array<Row["id"]>;
};

const ContentDataTable = ({
  columns = [],
  data = [],
  //   onSelectAll,
  // onSelectRow,
  // selectedRows = [],
}: DataTableProps) => {
  //   const allSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow">
      {/* <input type="checkbox" checked={allSelected} onChange={onSelectAll} /> */}
      <table className="w-full">
        <thead className="">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-c2 text-gray-70 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            // const isSelected = selectedRows.includes(row.id);

            return (
              <tr key={row.id || index} className="text-c2 text-gray-70 text-center">
                {columns.map((col) => (
                  <td key={col.key} className="p-2">
                    {row[col.key]}
                  </td>
                ))}
                {/* <td className="p-2">
                  <Checkbox checked={isSelected} onChange={() => onSelectRow(row.id)} />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ContentDataTable;
