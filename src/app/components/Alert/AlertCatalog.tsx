'use client';
import { Alert } from "./Alert";

const alertTypes = ['default', 'success', 'info', 'warning', 'error'] as const;
const variants = ['filled', 'subtle'] as const;

export const AlertCatalog = () => {
  return (
    <div className="space-y-8 p-6">
      {variants.map((variant) => (
        <div key={variant}>
          <h2 className="text-xl font-bold mb-4 capitalize">{variant}</h2>
          <div className="grid md:grid-cols-2 gap-4 border border-dashed rounded-xl p-6">
            {alertTypes.map((type) => (
              <Alert
                key={`${variant}-${type}`}
                variant={variant}
                type={type}
                title="Title"
                description="Get immediate alerts and a notification badge."
                showPrimaryButton={true}
                showSecondaryButton={true}
                primaryLabel="Button"
                secondaryLabel="Button"
                onPrimaryClick={() => console.log(`Primary clicked [${type}]`)}
                onSecondaryClick={() => console.log(`Secondary clicked [${type}]`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
