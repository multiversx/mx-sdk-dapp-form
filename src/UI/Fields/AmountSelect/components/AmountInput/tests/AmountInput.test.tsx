import React, { useState } from 'react';

import { fireEvent, render } from '@testing-library/react';
import { AmountInput, AmountInputPropsType } from '../AmountInput';

const AmountWrapper = () => {
  const [value, setValue] = useState('');

  const props: AmountInputPropsType = {
    'data-testid': 'amountInput',
    // InfoDustComponent?: JSX.Element;
    // disabled?: boolean;
    // error?: string;
    // handleBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    handleChange: (e) => {
      setValue(e.target.value);
    },
    // isInvalid?: boolean;
    name: 'amountInput',
    // onDebounceChange?: (amount: string) => void;
    // onFocus?: () => void;
    // onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    // placeholder?: string;
    // readonly?: boolean;
    required: false,
    // usdPrice?: number;
    value
    // usdValue?: string;
    // allowNegative?: boolean;
    // autoFocus?: boolean;
    // suffix?: string;
  };
  return <AmountInput {...props} />;
};

describe('AmountInput tests', () => {
  test('usdPrice changes according to value', async () => {
    const container = render(<AmountWrapper />);
    const input: any = container.getByTestId('amountInput');
    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: '2' } });
    expect(input.value).toBe('2');
  });
});
