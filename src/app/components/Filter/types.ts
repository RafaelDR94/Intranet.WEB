export interface FilterOption {
  /** Visible label for the option. */
  label: string;
  /** Unique identifier returned when the option is selected. */
  value: string;
  /** If provided, disables the option. */
  disabled?: boolean;
}

export type FilterProps = {
  /** Title displayed at the top of the contextual menu. */
  title?: string;
  /** List of options rendered inside the filter menu. */
  options: FilterOption[];
  /** Optional custom trigger; defaults to the filter icon button. */
  trigger?: React.ReactNode;
  /** Currently selected option. Works in both controlled and uncontrolled modes. */
  selectedValue?: string | null;
  /** Default value when uncontrolled. */
  defaultValue?: string | null;
  /** Invoked when the user selects an option. */
  onChange?: (value: string) => void;
};
