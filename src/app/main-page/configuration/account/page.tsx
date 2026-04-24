"use client";

import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import CreateEmployee from "../../administration/usersmanagment/createemployee/CreateEmployee";

const AccountPage = () => {
  const loggedUser = useAuthStore((state) => state.user);

  return <CreateEmployee loggedUser={loggedUser} onConfigurations={true} />;
};

export default AccountPage;
