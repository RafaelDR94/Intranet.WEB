import { LabelMode } from "../../types";
export type StyleProps = {
  trackClass?: string;
  fillClass?: string;
  dotActiveClass?: string;
  dotInactiveClass?: string;
};
export  type LinearProps = {
  min: number;
  max: number;
  divisions: number;
  level: number;
  setLevel: (v: number) => void;
  labelMode: LabelMode;
  decimals: number;
};