export interface ProgressCardProps {
  /** Percent completed 0-100 */
  percentage: number;
  /** Main title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Size of donut in px */
  size?: number;
  /** data-testid for container */
  dataTestId?: string;
  /** Extra classes for container */
  className?: string;
}

