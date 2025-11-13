import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";

const useTools = () => {
  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
    }),
    shallow,
  );
  return {
    current,
  };
};
export default useTools;
