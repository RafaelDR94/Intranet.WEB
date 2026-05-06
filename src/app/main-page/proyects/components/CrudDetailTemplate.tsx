'use client';

import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import { Button } from '@/app/components/Button/Button';
import type { CrudDetailItem } from './types';

type CrudDetailTemplateProps = {
  title: string;
  details: CrudDetailItem[];
  onClose: () => void;
  onEdit: () => void;
};

const CrudDetailTemplate = ({
  title,
  details,
  onClose,
  onEdit,
}: CrudDetailTemplateProps) => {
  return (
    <div className="relative min-h-[520px]">
      <DetailsPanelLayout
        open
        withinContainer
        expanded
        divider
        onClose={onClose}
        actionButton={
          <Button hideIcon size="small" onClick={onEdit}>
            Editar
          </Button>
        }
      >
        <div className="space-y-5">
          <div>
            <h2 className="text-s1 text-gray-100">{title}</h2>
            <p className="mt-2 text-b3 text-gray-70">
              Aqui ira el contenido detallado del registro seleccionado.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-20 bg-white-100 p-4">
                <p className="text-c2 text-gray-60">{item.label}</p>
                <p className="mt-1 text-b3 text-gray-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </DetailsPanelLayout>
    </div>
  );
};

export default CrudDetailTemplate;
