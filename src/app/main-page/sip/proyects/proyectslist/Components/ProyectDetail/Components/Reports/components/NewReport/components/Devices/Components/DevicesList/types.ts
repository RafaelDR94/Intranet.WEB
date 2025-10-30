export type Props = {
  selectedRowId: string | null;           
  onCreate: () => void;                   
  onEdit: (rowId: string) => void;        
};