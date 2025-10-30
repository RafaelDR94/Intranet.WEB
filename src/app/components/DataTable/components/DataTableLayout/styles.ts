import { useIsMobile } from "./hooks/useMediaQuery";

export const useTableLayoutStyles = () => {
  const isMobile = useIsMobile();

  return {
    headerdiv: "relative z-[60] flex items-center flex-wrap gap-2",
    inputSyle: isMobile
      ? "max-w-[285px] min-w-[230px]"
      : "max-w-[400px] min-w-[380px]",
    buttonsStyle: "flex items-center gap-2 ml-auto",
  } as const;
};