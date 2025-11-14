
import useInformation from "./hooks/useInformation";
import InfoCards from "@/app/components/InfoCards/InfoCards";

const Information = () => {
  const { cards } = useInformation();

  return (
    <>
      <InfoCards
        cards={cards || []}
        maxWidthClassName="max-w-6xl"
        dataTestId="report-info-cards"
        responsiveLayoutMatrix={{
          sm: [[5, 5], [10], [10], [10], [10]],
          md: [[10], [6, 4], [10], [10], [10], [10]],
        }}
      />
    </>
  );
};
export default Information;
