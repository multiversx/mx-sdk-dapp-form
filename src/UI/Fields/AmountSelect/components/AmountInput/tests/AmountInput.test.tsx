import React, { useState } from 'react';

import { render, waitFor } from '@testing-library/react';
import { AmountInput, AmountInputPropsType } from '../AmountInput';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

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
  test('Prevent leading zeroes', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');

    await userEvent.clear(input);
    await userEvent.type(input, '0');
    await userEvent.tab();
    await sleep();

    expect(input.value).toBe('0');

    await userEvent.clear(input);
    await userEvent.type(input, '00');
    await userEvent.tab();
    await sleep();
    expect(input.value).toBe('0');

    await userEvent.clear(input);
    await userEvent.type(input, '02');
    await userEvent.tab();
    await sleep();
    expect(input.value).toBe('0');
  });

  test('Allow leading zero if succeded by dot', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');

    await userEvent.clear(input);
    await userEvent.type(input, '0');
    await userEvent.tab();
    expect(input.value).toBe('0');

    await userEvent.clear(input);
    await userEvent.type(input, '0.');
    await userEvent.tab();
    await sleep();
    expect(input.value).toBe('0');

    await userEvent.clear(input);
    await userEvent.type(input, '0.62');
    await userEvent.tab();
    await sleep();
    expect(input.value).toBe('0.62');
  });

  test('usdValue changes according to input value', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');

    expect(container.queryByTestId(testId)).not.toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, '2');
    await userEvent.tab();
    await sleep();

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $8.00');
    });

    await userEvent.clear(input);
    await userEvent.type(input, '8');
    await userEvent.tab();
    await sleep();

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

    await userEvent.clear(input);
    await userEvent.type(input, '1');
    await userEvent.tab();
    await sleep();
    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $4.00');
    });

    await userEvent.clear(input);
    await userEvent.type(input, '2');
    await userEvent.tab();
    await sleep();

    await waitFor(() => {
      const usdValueLabel: any = container.getByTestId(testId);
      expect(usdValueLabel.innerHTML).toBe('≈ $16.23');
    });
  });
});
