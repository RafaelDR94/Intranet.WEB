import {
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import { LinearProps } from "../types";

type UseLinearLevelParams = Pick<
  LinearProps,
  "min" | "max" | "divisions" | "level" | "setLevel"
>;

type UseLinearLevelResult = {
  barRef: RefObject<HTMLDivElement | null>
  percent: number;
  ticks: number[];
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const useLinearLevel = ({
  min,
  max,
  divisions,
  level,
  setLevel,
}: UseLinearLevelParams): UseLinearLevelResult => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const percent = useMemo(() => {
    if (max === min) return 0;
    return (level - min) / (max - min);
  }, [level, min, max]);

  const step = useMemo(() => {
    if (divisions === 0) return 0;
    return (max - min) / divisions;
  }, [divisions, max, min]);

  const setByClientX = useCallback(
    (clientX: number) => {
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect) return;
      const t = (clientX - rect.left) / rect.width;
      const value = min + Math.min(1, Math.max(0, t)) * (max - min);
      setLevel(clamp(value, min, max));
    },
    [max, min, setLevel]
  );

  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setByClientX(event.clientX);
      dragging.current = true;
    },
    [setByClientX]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      setByClientX(event.clientX);
    },
    [setByClientX]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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

  const ticks = useMemo(
    () => Array.from({ length: divisions + 1 }, (_, i) => i),
    [divisions]
  );

  return {
    barRef,
    percent,
    ticks,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onKeyDown,
  };
};

export default useLinearLevel;
