import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatCurrency } from '@/app/utilities/FormatHelpers/FormatHelpets';
import PerDiemBalanceCard from './PerDiemBalanceCard';

const props = {
  startDate: '2025-01-01',
  endDate: '2025-01-10',
  requestedAmount: 1000,
  verifiedAmount: 600,
  enterpriseAmount: 300,
  employeeAmount: 100,
  elapsedDays: 3,
  totalDays: 5,
  percentage: 60,
};

describe('PerDiemBalanceCard', () => {
  it('renders requested and verified amounts', () => {
    render(<PerDiemBalanceCard {...props} />);
    expect(screen.getByText('Balance de viáticos')).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(props.requestedAmount))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(props.verifiedAmount))).toBeInTheDocument();
  });
});
