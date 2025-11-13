import usePersonaL from "./hooks/usePersonal";

const Personal = () => {
  const { current } = usePersonaL();
  console.log(current);
  
  return <>Personal</>;
};
export default Personal;
