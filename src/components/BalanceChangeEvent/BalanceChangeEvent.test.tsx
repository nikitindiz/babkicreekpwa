import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BalanceChangeEvent } from './BalanceChangeEvent';
import * as useIsMobileModule from '../../utils/hooks/useIsMobile';

// Mock the `useIsMobile` hook
jest.mock('../../utils/hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

describe('<BalanceChangeEvent />', () => {
  const mockUseIsMobile = useIsMobileModule.useIsMobile as ReturnType<typeof jest.fn>;

  it('renders correctly', () => {
    const { container } = render(<BalanceChangeEvent />);
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<BalanceChangeEvent className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders incomes and expenses sections', () => {
    const { getByText } = render(
      <BalanceChangeEvent
        incomesSection={<div>Income</div>}
        expensesSection={<div>Expense</div>}
      />,
    );
    expect(getByText('Income')).toBeInTheDocument();
    expect(getByText('Expense')).toBeInTheDocument();
  });

  describe('with different device types (mobile/desktop)', () => {
    it('applies mobile styles when on a mobile device', () => {
      mockUseIsMobile.mockReturnValue(true);
      const { container } = render(<BalanceChangeEvent flowThickness={10} />);
      const chartLine = container.querySelector('.chartLine');
      expect(chartLine).toHaveStyle('width: 10px');
    });

    it('applies desktop styles when not on a mobile device', () => {
      mockUseIsMobile.mockReturnValue(false);
      const { container } = render(<BalanceChangeEvent flowThickness={10} />);
      const chartLine = container.querySelector('.chartLine');
      expect(chartLine).toHaveStyle('height: 10px');
    });
  });

  it('applies custom line styles', () => {
    const lineStyles = { backgroundColor: 'red' };
    const { container } = render(<BalanceChangeEvent lineStyles={lineStyles} />);
    const chartLine = container.querySelector('.chartLine');
    expect(chartLine).toHaveStyle('background-color: red');
  });
});
