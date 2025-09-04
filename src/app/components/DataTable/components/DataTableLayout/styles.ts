import { useIsMobile } from "./hooks/useMediaQuery";

export const useTableLayoutStyles = () => {
  const isMobile = useIsMobile();

  return {
    headerdiv: "flex items-center flex-wrap",
    inputSyle: isMobile
      ? "max-w-[300px] min-w-[285px]"
      : "max-w-[400px] min-w-[380px]",
    buttonsStyle: "flex space-x-4 ml-auto",
  } as const;
};