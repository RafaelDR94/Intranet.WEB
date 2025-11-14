import { Button } from "@/app/components/Button/Button";
import useInformation from "./hooks/useInformation";
import InfoCards from "@/app/components/InfoCards/InfoCards";

const Information = () => {
  const { cards, handleEditInformation } = useInformation();

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
      <div className="flex justify-end">
        <Button
          size="medium"
          variant="outline"
          hideIcon
          style={{ marginBlock: "10px" }}
          onClick={() => {
            handleEditInformation();
          }}
        >
          Editar Información
        </Button>
      </div>
    </>
  );
};
export default Information;
