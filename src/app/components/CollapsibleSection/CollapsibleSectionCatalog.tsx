'use client';

import { CollapsibleSection } from './CollapsibleSection';

export default function CollapsibleSectionCatalog() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-h3 font-display">CollapsibleSection</h2>

      <CollapsibleSection title="Open by default">
        <p>This content is visible by default.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Closed initially" defaultOpen={false}>
        <p>This content appears after clicking the header.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Disabled collapse" enableCollapse={false}>
        <p>The header cannot collapse this section.</p>
      </CollapsibleSection>
    </div>
  );
}
