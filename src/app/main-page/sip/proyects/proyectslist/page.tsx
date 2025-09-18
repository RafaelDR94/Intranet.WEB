
"use client";
import { useSearchParams } from "next/dist/client/components/navigation";

import ProyectDetail from "./Components/ProyectDetail/ProyectDetail";
import ProyectList from "./Components/ProyectList/ProyectList";
const ProyectsListPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id) return <ProyectDetail />;
  return <ProyectList />
};

export default ProyectsListPage;
