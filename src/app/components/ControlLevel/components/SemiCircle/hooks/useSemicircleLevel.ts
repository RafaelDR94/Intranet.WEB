import {
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { UseSemicircleResult ,UseSemicircleParams,SliceData} from "../types";

export const HUB_RADIUS_BASE = 12;
export const VIEWBOX_WIDTH = 220;
export const VIEWBOX_HEIGHT = 120;


const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const useSemicircleLevel = ({
  min,
  max,
  divisions,
  level,
  setLevel,
}: UseSemicircleParams): UseSemicircleResult => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const cx = VIEWBOX_WIDTH / 2;
  const cy = VIEWBOX_HEIGHT;
  const radius = useMemo(() => Math.min(cx, VIEWBOX_HEIGHT - 4), [cx]);
  const hubRadius = useMemo(
    () => Math.max(8, (HUB_RADIUS_BASE * radius) / 110),
    [radius]
  );

  const valueToAngle = useCallback(
    (value: number) => {
      if (max === min) return Math.PI;
      return Math.PI * (1 - (value - min) / (max - min));
    },
    [max, min]
  );

  const angleToValue = useCallback(
    (angle: number) => {
      if (max === min) return min;
      return min + (1 - angle / Math.PI) * (max - min);
    },
    [max, min]
  );

  const pointOnArc = useCallback(
    (angle: number) => ({
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    }),
    [cx, cy, radius]
  );

  const sectorPathFromTo = useCallback(
    (start: number, end: number) => {
      const pStart = pointOnArc(start);
      const pEnd = pointOnArc(end);
      return `M ${cx} ${cy} L ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 0 1 ${pEnd.x} ${pEnd.y} Z`;
    },
    [cx, cy, pointOnArc, radius]
  );

  const handlePointer = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      const scaleX = VIEWBOX_WIDTH / rect.width;
      const scaleY = (VIEWBOX_HEIGHT + 6) / rect.height;
      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;

      const x = svgX - cx;
      const y = cy - svgY;

      let angle = Math.atan2(y, x);
      if (angle < 0) angle = 0;
      if (angle > Math.PI) angle = Math.PI;

      setLevel(clamp(angleToValue(angle), min, max));
    },
    [angleToValue, cx, cy, max, min, setLevel]
  );

  const onClick = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      handlePointer(event.clientX, event.clientY, rect);
    },
    [handlePointer]
  );

  const onMouseDown = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      event.preventDefault();
      dragging.current = true;
      onClick(event);
    },
    [onClick]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      if (!dragging.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      handlePointer(event.clientX, event.clientY, rect);
    },
    [handlePointer]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const step = useMemo(() => {
    if (divisions === 0) return 0;
    return (max - min) / divisions;
  }, [divisions, max, min]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<SVGSVGElement>) => {
      if (step === 0) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLevel(clamp(level - step, min, max));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setLevel(clamp(level + step, min, max));
      }
    },
    [level, max, min, setLevel, step]
  );

  const activeAngle = useMemo(
    () => valueToAngle(level),
    [level, valueToAngle]
  );

  const backgroundSlices = useMemo(
    () =>
      Array.from({ length: divisions }, (_, index) => {
        const start = Math.PI - (Math.PI * index) / divisions;
        const end = Math.PI - (Math.PI * (index + 1)) / divisions;
        return { start, end, index };
      }),
    [divisions]
  );

  const activeSlices = useMemo(
    () =>
      backgroundSlices.reduce<SliceData[]>((acc, slice) => {
        if (activeAngle > slice.start) return acc;
        const arcEnd = activeAngle <= slice.end ? slice.end : activeAngle;
        if (arcEnd === slice.start) return acc;
        acc.push({ start: slice.start, end: arcEnd, index: slice.index });
        return acc;
      }, []),
    [activeAngle, backgroundSlices]
  );

  const hubPath = useMemo(
    () =>
      `M ${cx - hubRadius} ${cy}
       A ${hubRadius} ${hubRadius} 0 0 1 ${cx + hubRadius} ${cy}
       L ${cx} ${cy} Z`,
    [cx, cy, hubRadius]
  );

  return {
    svgRef,
    backgroundSlices,
    activeSlices,
    hubPath,
    viewBox: `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT + 6}`,
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onKeyDown,
    sectorPathFromTo,
  };
};

export default useSemicircleLevel;
