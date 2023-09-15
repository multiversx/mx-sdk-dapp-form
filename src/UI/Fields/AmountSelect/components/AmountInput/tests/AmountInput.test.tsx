import React, { useState } from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { AmountInput, AmountInputPropsType } from '../AmountInput';

const dataTestId = 'amountInput';
const usdPrice = 4;
const testId = `tokenPrice_${usdPrice}`;

const AmountWrapper = ({
  usdValueCalculator
}: {
  usdValueCalculator?: (val: string) => string | undefined;
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
    usdPrice,
    value,
    usdValue
  };

  return <AmountInput {...props} />;
};

describe('AmountInput tests', () => {
  test('usdValue changes according to input value', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');

    expect(container.queryByTestId(testId)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $8.00');
    });

    fireEvent.change(input, { target: { value: '8' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $32.00');
    });
  });

  test('external usdValue is displayed when provided', async () => {
    const container = render(
      <AmountWrapper
        usdValueCalculator={(val) => (val == '2' ? '16.23' : undefined)}
      />
    );
    const input: any = container.getByTestId('amountInput');

    fireEvent.change(input, { target: { value: '1' } });
    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $4.00');
    });

    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $16.23');
    });
  });
});
