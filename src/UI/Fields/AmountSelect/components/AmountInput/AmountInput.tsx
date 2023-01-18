import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import BigNumber from 'bignumber.js';
import {
  NumberFormatValues,
  NumericFormat,
  OnValueChange
} from 'react-number-format';
import {
  removeCommas,
  roundAmount,
  ImprovedDebounceValueType,
  useImprovedDebounce
} from './helpers';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation';

export interface AmountInputPropsType {
  readonly?: boolean;
  required: boolean;
  name: string;
  placeholder: string;
  'data-testid'?: string;
  value: string;
  error?: string;
  isInvalid?: boolean;
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
}: AmountInputPropsType) => {
  const ref = useRef(null);

  const [debounceValue, setDebounceValue] = useState<ImprovedDebounceValueType>(
    { value, count: 0 }
  );
  const [values, setValues] = useState<NumberFormatValues>();
  const [usdValue, setUsdValue] = useState<string>();

  const debounceAmount = useImprovedDebounce(debounceValue, fiveHundredMs);

  const formattedValue = useMemo(() => {
    const newFormattedValue = values?.formattedValue ?? '';
    if (removeCommas(newFormattedValue) === value) {
      return newFormattedValue;
    }
    return value;
  }, [values, value]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = removeCommas(e.target.value);

    if (newValue === '' || stringIsFloat(newValue)) {
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

  const onValueChange: OnValueChange = (newValues) => {
    console.log(newValues);
    setValues(newValues);
  };

  useEffect(() => {
    if (onDebounceChange) {
      onDebounceChange(debounceAmount.value);
    }
  }, [debounceAmount]);

  useEffect(updateUsdValue, [value, tokenUsdPrice]);

  return (
    <div className={`amount-holder w-100 ${usdValue ? 'show-usd-value' : ''} `}>
      <NumericFormat
        getInputRef={ref}
        thousandSeparator=','
        thousandsGroupStyle='thousand'
        decimalSeparator='.'
        allowedDecimalSeparators={['.', ',']}
        inputMode='decimal'
        onValueChange={onValueChange}
        required={required}
        className='amount-input form-control'
        style={{ fontSize: '16px' }}
        data-testid={dataTestId || name}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formattedValue}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={handleBlur}
        autoComplete='off'
        disabled={Boolean(disabled)}
        readOnly={Boolean(readonly)}
        onFocus={onFocus}
      />

      {usdValue && (
        <span className='amount-holder-usd d-flex text-secondary'>
          <small>
            {usdValue !== '$0' ? <>≈ </> : <></>}
            {usdValue}
          </small>
        </span>
      )}
    </div>
  );
};
