import useTools from "./hooks/useTools";

const Tools = () => {
  const { current } = useTools();
  console.log(current);
  
  return <>Herramientas</>;
};
export default Tools;
