import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import BigNumber from 'bignumber.js';
import { NumericFormat } from 'react-number-format';
import {
  removeCommas,
  roundAmount,
  ImprovedDebounceValueType,
  useImprovedDebounce
} from './helpers';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation';

export const maxAcceptedAmount = 10000000000000; // 10 trillions TODO: remove

interface AmountInputType {
  readonly?: boolean;
  required: boolean;
  name: string;
  placeholder: string;
  'data-testid'?: string;
  value: string;
  disabled?: boolean;
  tokenUsdPrice?: string;
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: (e: FocusEvent<any>) => void;
  onKeyDown?: () => void;
  onFocus?: () => void;
  onDebounceChange?: (amount: string) => void;
}

const fiveHundredMs = 500;

export const AmountInput = ({
  readonly,
  required,
  name,
  placeholder,
  value,
  disabled,
  tokenUsdPrice,
  'data-testid': dataTestId,
  handleChange,
  handleBlur,
  onKeyDown,
  onFocus,
  onDebounceChange
}: AmountInputType) => {
  const ref = useRef(null);

  const [debounceValue, setDebounceValue] = useState<ImprovedDebounceValueType>(
    { value, count: 0 }
  );
  const [usdValue, setUsdValue] = useState<string>();

  const debounceAmount = useImprovedDebounce(debounceValue, fiveHundredMs);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = removeCommas(e.target.value);
    const isBelowMax =
      stringIsFloat(newValue) && parseFloat(newValue) <= maxAcceptedAmount;

    if (newValue === '' || isBelowMax) {
      e.target.value = newValue;
      handleChange(e);

      const newDebounceValue = {
        value: newValue,
        count: debounceValue.count + 1
      };
      setDebounceValue(newDebounceValue);
    }
  };

  const updateUsdValue = () => {
    if (!tokenUsdPrice) {
      setUsdValue(undefined);
      return;
    }

    const amount = removeCommas(value);
    const isValid = value !== '' && stringIsFloat(amount);

    if (!isValid || amount === '') {
      setUsdValue(undefined);
      return;
    }

    const newUsdValue = roundAmount(
      new BigNumber(
        parseFloat(amount) * parseFloat(tokenUsdPrice ?? '0')
      ).toString(10),
      2
    );

    setUsdValue(`$${newUsdValue}`);
  };

  useEffect(() => {
    if (onDebounceChange) {
      onDebounceChange(debounceAmount.value);
    }
  }, [debounceAmount]);

  useEffect(updateUsdValue, [value, tokenUsdPrice]);

  return (
    <div
      className={`amount-holder w-100 ${usdValue ? 'show-usd-value' : ''} `}
      ref={ref}
    >
      <NumericFormat
        thousandSeparator={','}
        decimalSeparator={'.'}
        allowedDecimalSeparators={['.', ',']}
        inputMode='decimal'
        isAllowed={({ floatValue }) =>
          !floatValue || floatValue <= maxAcceptedAmount
        }
        required={required}
        className='amount-input form-control'
        style={{ fontSize: '16px' }}
        data-testid={dataTestId || name}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={handleBlur}
        autoComplete='off'
        disabled={disabled ?? false}
        readOnly={readonly ?? false}
        onFocus={onFocus}
      />

      {usdValue && (
        <span className='amount-holder-usd d-flex text-secondary'>
          <small>
            {usdValue !== '$0' ? <>≈&nbsp;</> : <></>}
            {usdValue}
          </small>
        </span>
      )}
    </div>
  );
};
