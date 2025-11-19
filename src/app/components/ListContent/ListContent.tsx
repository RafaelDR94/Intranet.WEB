interface ListContentProps {
  dataTable: any[];
  dataTableSecondary?: any[];
  renderAction?: (item: any) => React.ReactNode;
}

const ListContent = ({
  dataTable = [],
  dataTableSecondary = [],
  renderAction,
}: ListContentProps) => {
  return (
    <div className="w-full space-y-2">
      {/* Tabla principal */}
      {dataTable.length > 0 && (
        <div className="bg-white-100 rounded-2xl shadow-md">
          {dataTable.map((item, index) => (
            <div key={item.id || index}>
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3 text-base">
                  <span className="text-gray-70 w-6 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-gray-70">{item?.name}</span>
                </div>
                {/* <<--- BOTÓN DINÁMICO */}
                <div>
                  {renderAction && renderAction(item)}{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla secundaria */}
      {dataTableSecondary.length > 0 && (
        <div className="bg-white-100 rounded-2xl p-2 shadow-md">
          {dataTableSecondary.map((item, index) => (
            <div key={item.id || index}>
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-3 text-base">
                  <span className="text-c2 w-6 text-right text-gray-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-gray-70 text-c2">{item.name}</span>
                </div>
                {/* <<--- BOTÓN DINÁMICO */}
                <div>
                  {renderAction && renderAction(item)}{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {dataTable.length <= 0 && dataTableSecondary.length <= 0 && (
        <div className="bg-white-100 space-y-2 rounded-2xl p-4 shadow-md">
          <p className="text-c2">No se encontraron resultados</p>
        </div>
      )}
    </div>
  );
};

export default ListContent;
