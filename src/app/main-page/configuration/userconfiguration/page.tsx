import Password from "./components/Password/Password";
import Nip from "./components/NIP/NIP";
import Signature from "./components/Signature/Signature";

const UserConfiguration = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-h4 font-semibold text-gray-90">Configuración</h1>
        <p className="text-b2 text-gray-60">
          Ajusta la seguridad y firma digital de tu cuenta.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        <Password />
        <Nip />
        <Signature />
      </section>
    </div>
  );
};

export default UserConfiguration;
