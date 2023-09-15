import React, { useState } from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { AmountInput, AmountInputPropsType } from '../AmountInput';

const dataTestId = 'amountInput';

const AmountWrapper = ({
  usdValueCalculator
}: {
  usdValueCalculator?: (val: string) => string;
}) => {
  const [value, setValue] = useState('');

  const usdValue = usdValueCalculator ? usdValueCalculator(value) : undefined;

  const props: AmountInputPropsType = {
    'data-testid': dataTestId,
    handleChange: (e) => {
      setValue(e.target.value);
    },
    name: 'amountInput',
    required: false,
    usdPrice: 4,
    value,
    usdValue
  };
  return <AmountInput {...props} />;
};

describe('AmountInput tests', () => {
  test('usdValue changes according to input value', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');

    expect(
      container.queryByTestId(`usdValue_${dataTestId}`)
    ).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(
        `usdValue_${dataTestId}`
      );
      expect(usdValueLabel.innerHTML).toBe('≈ $8.00');
    });

    fireEvent.change(input, { target: { value: '8' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(
        `usdValue_${dataTestId}`
      );
      expect(usdValueLabel.innerHTML).toBe('≈ $32.00');
    });
  });

  test('external usdValue is displayed when provided', async () => {
    const container = render(
      <AmountWrapper
        usdValueCalculator={(val) => {
          if (val == '2') {
            return '16.23';
          }
          return (parseInt(val) * 8).toString();
        }}
      />
    );
    const input: any = container.getByTestId('amountInput');

    fireEvent.change(input, { target: { value: '1' } });
    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(
        `usdValue_${dataTestId}`
      );
      expect(usdValueLabel.innerHTML).toBe('≈ $8');
    });

    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(
        `usdValue_${dataTestId}`
      );
      expect(usdValueLabel.innerHTML).toBe('≈ $16.23');
    });
  });
});
