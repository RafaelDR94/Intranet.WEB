import { WorkPositionType } from "./workposition.types";

export const mapWorkPosition = (wp: any): WorkPositionType => ({
  workposition_id: wp?.workposition_id,
  name: wp?.name,
});

export const mapWorkPositions = (wps: any[]): WorkPositionType[] => wps.map(mapWorkPosition);
