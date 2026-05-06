type ProyectsPlaceholderPageProps = {
  title: string;
};

const ProyectsPlaceholderPage = ({ title }: ProyectsPlaceholderPageProps) => {
  return (
    <section className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-20 bg-white-100 p-8">
      <div className="text-center">
        <h1 className="text-s1 text-gray-100">{title}</h1>
        <p className="mt-3 text-b3 text-gray-70">Aqui ira el contenido de la pagina.</p>
      </div>
    </section>
  );
};

export default ProyectsPlaceholderPage;
