'use client';

import { Button } from './Button';

export default function ButtonCatalog() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-h3 font-display">Button</h2>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button size="giant">Giant</Button>
          <Button size="large">Large</Button>
          <Button size="medium">Medium</Button>
          <Button size="small">Small</Button>
          <Button size="xsmall">Xsmall</Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button iconOnly aria-label="Next" />
          <Button hideIcon>Without icon</Button>
        </div>
      </div>
    </div>
  );
}
