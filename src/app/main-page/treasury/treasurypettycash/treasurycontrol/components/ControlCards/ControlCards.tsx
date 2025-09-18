import { SummaryCard } from "./components/SummaryCard/SummaryCard";
import TicketPink from "@/assets/svgs/ticket-pink.svg";
import TicketGreen from "@/assets/svgs/ticket-green.svg";
import TicketBlue from "@/assets/svgs/ticket-blue.svg";
import TicketYellow from "@/assets/svgs/ticket-yellow.svg";
import SecTicketPink from "@/assets/svgs/secondTicketP.svg"
import SecTicketGreen from "@/assets/svgs/secondTicketG.svg"
import SecTicketBlue from "@/assets/svgs/secondTicketB.svg"
import SecTicketYellow from "@/assets/svgs/secondTicketY.svg"

import Summary from "./components/Summary/Summary";

const ControlCards = () => {
  return (
    <div className="flex justify-between">
      <div className="rounded-lg w-[36%]">
        <Summary
          date={new Date(2025, 8, 25)}
          assigned={30010.03}
          available={15000}
          percent={50}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <SummaryCard
            title="Monto comprobado"
            subtitle="10 vales Rosas"
            amount={9000}
            statusLabel="Comprobados"
            SvgIcon={TicketPink}
            SvgSecondIcon={SecTicketPink}
            trend="up"
            accent="green" // monto verde
            amountDigits={0}
          />

          <SummaryCard
            title="Efectivo"
            subtitle="Fijo asignado: $625.00"
            amount={250}
            statusLabel="Utilizados"
            SvgIcon={TicketGreen}
            SvgSecondIcon={SecTicketGreen}
            trend="down"
            accent="green" // como la maqueta: valor en verde
            amountDigits={2} // $250.00
          />
        </div>
        <div className="flex">
          <SummaryCard
            title="Monto no comprobado"
            subtitle="6 vales Azules"
            amount={5000}
            statusLabel="No deducibles"
            SvgIcon={TicketBlue}
            SvgSecondIcon={SecTicketBlue}
            trend="down"
            accent="red" // monto en rojo
            amountDigits={0}
          />

          <SummaryCard
            title="Pendientes por comprobar"
            subtitle="2 vales Pendientes"
            amount={1000}
            statusLabel="Pendientes"
            SvgIcon={TicketYellow}
            SvgSecondIcon={SecTicketYellow}
            trend="dot"
            accent="yellow" // monto en naranja
            amountDigits={2} // si quieres 1,000.00; cambia a 0 si no
          />
        </div>
      </div>
    </div>
  );
};

export default ControlCards;
