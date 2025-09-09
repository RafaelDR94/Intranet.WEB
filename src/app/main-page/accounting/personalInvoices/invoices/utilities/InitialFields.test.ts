import { describe, it, expect } from 'vitest';

import { createInvoiceFields, createTicketFields } from './InitialFields';

describe('InitialFields utilities', () => {
  it('createInvoiceFields returns XML and PDF fields', () => {
    const fields = createInvoiceFields();
    const names = fields.map(f => f.name);
    expect(names).toContain('xml');
    expect(names).toContain('pdf');
  });

  it('createTicketFields returns ticket field', () => {
    const fields = createTicketFields();
    const names = fields.map(f => f.name);
    expect(names).toContain('ticket');
  });
});
