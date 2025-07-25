export type Variant = 'solid' | 'outline' | 'ghost';
export type Size = 'giant' | 'large' | 'medium' | 'small' | 'xsmall';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  arrowDirection?: 'right' | 'up';
  iconOnly?: boolean;
}