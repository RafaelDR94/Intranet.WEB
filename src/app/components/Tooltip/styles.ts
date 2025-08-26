export const tooltipStyles = {
  tooltipCtn: "relative inline-flex items-center group",
  tooltip:
  "absolute z-10 hidden group-hover:flex items-center justify-center text-white-100 text-sm font-medium px-3 py-2 rounded-md bg-green-90 max-w-[200px] w-max break-words whitespace-normal text-center",
  tooltipAfter:
    'after:content-[""] after:absolute after:border-[6px] after:border-transparent items-center',
  tooltipTop:
  "top-full left-1/2 -translate-x-1/2 mt-2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-green-90",
  tooltipBottom:
  "bottom-full left-1/2 -translate-x-1/2 mb-2 after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-green-90",
  tooltipLeft:
    "absolute left-full ml-2 after:absolute after:left-[-11px] after:top-1/2 after:-translate-y-1/2 after:border-y-6 after:border-r-6 after:border-y-transparent after:border-r-green-90",
  tooltipRight:
    "right-full mr-2 after:absolute after:right-[-11px] after:top-1/2 after:-translate-y-1/2 after:border-y-6 after:border-l-6 after:border-y-transparent after:border-l-green-90",
};