import React from 'react';
import { Button } from './Button';

const sizes = ['giant', 'large', 'medium', 'small', 'xsmall'] as const;
const variants = ['solid', 'outline', 'ghost'] as const;

type Size = typeof sizes[number];
type Variant = typeof variants[number];

export function ButtonGallery() {
  return (
    <div className="p-8 space-y-12">
      {sizes.map((size: Size) => (
        <section key={size} className="space-y-4">
          <h2 className="text-2xl font-semibold capitalize">Tamaño: {size}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {variants.map((variant: Variant) => (
              <div key={variant} className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Texto visible */}
                  <span className="w-16 text-sm font-medium capitalize">{variant}</span>
                  <Button size={size} variant={variant}>
                    {variant}
                  </Button>
                  <Button size={size} variant={variant} arrowDirection="up">
                    {variant} up
                  </Button>
                  <Button size={size} variant={variant} disabled>
                    Disabled
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Solo íconos */}
                  <span className="w-16 text-sm text-gray-60">iconOnly</span>
                  <Button size={size} variant={variant} iconOnly />
                  <Button size={size} variant={variant} arrowDirection="up" iconOnly />
                  <Button size={size} variant={variant} iconOnly disabled />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
