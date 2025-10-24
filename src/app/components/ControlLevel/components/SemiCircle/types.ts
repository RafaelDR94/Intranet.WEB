import { LabelMode } from "../../types";
import { RefObject ,MouseEvent,KeyboardEvent} from "react";

export type StyledProps = {
  backgroundClass?: string;
  activeClasses?: string[];
  hubClass?: string;
};
export type SemicircleProps = {
  min: number;
  max: number;
  divisions: number;
  level: number;
  setLevel: (v: number) => void;
  label: string;
  labelMode: LabelMode;
  decimals: number;
};

export type UseSemicircleParams = Pick<
  SemicircleProps,
  "min" | "max" | "divisions" | "level" | "setLevel"
>;

export type SliceData = {
  start: number;
  end: number;
  index: number;
};

export type UseSemicircleResult = {
  svgRef: RefObject<SVGSVGElement | null>
  backgroundSlices: SliceData[];
  activeSlices: SliceData[];
  hubPath: string;
  viewBox: string;
  onClick: (event: MouseEvent<SVGSVGElement>) => void;
  onMouseDown: (event: MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (event: MouseEvent<SVGSVGElement>) => void;
  onMouseUp: () => void;
  onKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
  sectorPathFromTo: (start: number, end: number) => string;
};