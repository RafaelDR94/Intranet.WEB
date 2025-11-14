import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

const useTools = () => {
  const router = useRouter();
  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
    }),
    shallow,
  );

  const handleEditTools = useCallback(() => {
      if (!current?.id) return;
      router.push(
        `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(current.id)}+&mode=edit`,
      );
    }, [current, router]);

  return {
    current,
    handleEditTools
  };
};
export default useTools;
