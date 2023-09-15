import React, { useState } from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { AmountInput, AmountInputPropsType } from '../AmountInput';

const dataTestId = 'amountInput';

const AmountWrapper = ({ usdValue }: { usdValue?: string }) => {
  const [value, setValue] = useState('');

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
    const container = render(<AmountWrapper usdValue={'16.23'} />);
    const input: any = container.getByTestId('amountInput');

    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(
        `usdValue_${dataTestId}`
      );
      expect(usdValueLabel.innerHTML).toBe('≈ $16.23');
    });
  });
});
