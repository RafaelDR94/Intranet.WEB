import PerDiemBalanceCard from "./components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
const RequisitionDetails = () => {
    return (<PerDiemBalanceCard
        startDate="2025-08-06"
        endDate="2025-08-15"
        requestedAmount={12100}
        verifiedAmount={6788.65}
        enterpriseAmount={1000}
        employeeAmount={3122}
        elapsedDays={7}
        totalDays={9}
        percentage={65}
    />);
}
export default RequisitionDetails;
