/**
 * Props for the {@link Donut} component.
 *
 * @property percentage - Value between 0 and 100 representing the filled portion of the donut.
 * @property size - Diameter of the SVG element. @defaultValue 200
 * @property thickness - Stroke width of the donut track. @defaultValue 30
 * @property innerRadius - Radius of the empty center. @defaultValue 70
 */
export type DonutProps = {
  percentage: number;
  size?: number;
  thickness?: number;
  innerRadius?: number;
};
