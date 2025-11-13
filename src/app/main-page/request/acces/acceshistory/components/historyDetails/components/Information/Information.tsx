import { Button } from "@/app/components/Button/Button";
import useInformation from "./hooks/useInformation";
import InfoCards from "@/app/components/InfoCards/InfoCards";

const Information = () => {
  const { current, cards } = useInformation();

  return (
    <>
      <InfoCards
        cards={cards || []}
        maxWidthClassName="max-w-6xl"
        dataTestId="report-info-cards"
        responsiveLayoutMatrix={{
          sm: [[5, 5], [10], [10], [10], [10]],
          md: [[10], [5, 5], [10], [10], [10], [10]],
        }}
      />
      <Button
        size="medium"
        variant="outline"
        hideIcon
        style={{ marginBlock: "10px" }}
        onClick={() => {
         console.log();
        }}
      >
        Editar Información
      </Button>
    </>
  );
};
export default Information;
