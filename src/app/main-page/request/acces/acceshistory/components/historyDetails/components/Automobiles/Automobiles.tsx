import useAutomobiles from "./hooks/useAutomobiles";

const Automobiles = () => {
  const { current } = useAutomobiles();

  console.log("current ", current);

  return <>Auto</>;
};

export default Automobiles;
