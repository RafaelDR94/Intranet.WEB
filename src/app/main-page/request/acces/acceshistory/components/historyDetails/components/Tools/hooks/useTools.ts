import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";
import { useMemo } from "react";

import type { Tools as Tool } from "@/app/mappings/accesrequest/accesrequest.types";

const parseTools = (value: unknown): Tool[] => {
  if (Array.isArray(value)) return value as Tool[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as Tool[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const useTools = () => {

  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
    }),
    shallow,
  );

  const tools = useMemo(
    () => parseTools((current?.tools ?? []) as unknown),
    [current?.tools],
  );



  return {
    current,
    tools,
  };
};
export default useTools;
