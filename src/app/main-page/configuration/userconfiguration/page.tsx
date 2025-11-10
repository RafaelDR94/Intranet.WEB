"use client";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import CreateEmployee from "../../administration/usersmanagment/createemployee/page";
import Password from "./components/Password/Password";
import Nip from "./components/NIP/NIP";
import Signature from "./components/Signature/Signature";

const UserConfiguration = () => {
  const loggedUser = useAuthStore((state) => state.user);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <CreateEmployee loggedUser={loggedUser} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        <Password />
        <Nip />
        <Signature />
      </div>
    </div>
  );
};

export default UserConfiguration;
