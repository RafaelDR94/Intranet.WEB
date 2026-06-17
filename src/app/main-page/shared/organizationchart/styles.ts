export const departmentsStyles = {
  container: "relative flex min-h-[calc(100vh-180px)] flex-col gap-6",
  searchRow: "mt-[4px] flex w-full items-center",
  searchWrapper: "w-full mt-[20px] flex items-center justify-between gap-4",
  searchInputWrapper: "w-full max-w-[380px]",
  searchInput: "w-full",
  viewToggle: "flex items-center",
  viewButton:
    "flex h-9 w-9 items-center justify-center rounded-md border border-gray-30 text-gray-70 transition-colors hover:border-blue-40 hover:text-blue-70",
  viewButtonActive: "border-blue-60 text-blue-70 shadow-200",
  listGrid: "flex flex-wrap gap-4",
  sectionHeader: "flex items-center gap-4 text-b3 text-blue-70",
  sectionDivider: "h-[0.5px] flex-1 bg-blue-60",
  listCard: "w-full rounded-xl bg-white-100 shadow-200 px-5 py-[2px]",
  listColumns: "w-full gap-4 [&>*]:min-w-0",
  listRow: "flex w-full items-center justify-between gap-4",
  listRowAvatar: "",
  listInfo: "flex min-w-0 flex-col justify-center gap-2",
  listLink: "text-green-100 hover:text-blue-80 text-c2",
  listLinkData: "block min-w-0 truncate whitespace-nowrap text-gray-70 text-b2",
  mosaicGrid: "flex flex-wrap gap-4",
  mosaicCard: "flex w-[314px] gap-4 rounded-xl bg-white-100 shadow-200",
  listAvatar: "flex h-[92px] w-[92px] items-center overflow-hidden rounded-xl",
  mosaicAvatar: "flex h-auto w-[100px] items-center overflow-hidden",
  mosaicInfo: "flex flex-1 flex-col gap-1 text-b3 text-gray-90 p-[16px] pl-0",
  mosaicCardInformation:
    "flex w-[314px] overflow-hidden rounded-xl bg-white-100 shadow-200",
  mosaicAvatarInformation:
    "relative h-full w-[100px] shrink-0 self-stretch overflow-hidden",
  mosaicAvatarResponsible: "w-[100px] shrink-0 self-stretch",
  mosaicInfoInformation:
    "flex h-full flex-1 flex-col items-start gap-[5px] p-[16px] text-b3 text-gray-90",
  mosaicInfoButton:
    "mt-auto w-full justify-center rounded-[8px] bg-green-80 px-[8px] py-[6px] text-c2 text-white-100 hover:bg-green-90",
  mosaicCompany: "text-c2 uppercase text-gray-60",
  mosaicName: "text-s2 font-semibold text-green-90",
  mosaicRole: "text-d3 text-gray-70",
  mosaicMeta: "text-d3 text-gray-70",
  emptyState: "bg-white-100 text-b3 text-gray-70 shadow-200 rounded-lg p-6",
  errorState:
    "bg-alert-red-10 text-b3 text-alert-red-100 shadow-200 rounded-lg p-6",
  pagination: "mt-auto flex w-full justify-center pt-2",
};
