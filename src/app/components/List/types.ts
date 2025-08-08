/** Item definition for List component */
export interface ListItem {
  /** Unique identifier */
  id: number
  /** Display label */
  label: string
  /** Control type rendered at right side */
  controlType: 'details' | 'badge' | 'arrow' | 'toggle' | 'radio' | 'checkbox' | 'control'
  /** Checkbox or radio checked state */
  checked?: boolean
  /** Show avatar before label */
  showAvatar: boolean
}

/** Props for List component */
export interface ListProps {
  /** Items to render */
  items: ListItem[]
}
