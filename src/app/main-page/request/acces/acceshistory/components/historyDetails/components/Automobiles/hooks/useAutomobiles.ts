import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";

const useAutomobiles = () => {
  const { current } = useAccesRequirementStore();
  console.log('current hook', current);
  
  return {
    current,
  };
};

export default useAutomobiles;
