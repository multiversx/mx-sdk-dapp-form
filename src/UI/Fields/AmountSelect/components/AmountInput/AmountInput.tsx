import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import {
  NumberFormatValues,
  NumericFormat,
  OnValueChange
} from 'react-number-format';

import globals from 'assets/sass/globals.module.scss';
import styles from './amountInput.module.scss';
import {
  removeCommas,
  roundAmount,
  ImprovedDebounceValueType,
  useImprovedDebounce
} from './helpers';

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
  tokenUsdPrice?: number;
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: (e: FocusEvent<any>) => void;
  onKeyDown?: () => void;
  onFocus?: () => void;
  onDebounceChange?: (amount: string) => void;
  InfoDustComponent?: JSX.Element;
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
  onDebounceChange,
  InfoDustComponent
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

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = removeCommas(event.target.value);

    if (newValue === '' || stringIsFloat(newValue)) {
      event.target.value = newValue;
      handleChange(event);

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
      new BigNumber(parseFloat(amount) * (tokenUsdPrice ?? 0)).toString(10),
      2
    );

    setUsdValue(`$${newUsdValue}`);
  };

  const onValueChange: OnValueChange = (newValues) => {
    setValues(newValues);
  };

  useEffect(() => {
    if (onDebounceChange) {
      onDebounceChange(debounceAmount.value);
    }
  }, [debounceAmount]);

  useEffect(updateUsdValue, [value, tokenUsdPrice]);
  return (
    <div
      className={classNames(`${styles.amountHolder}`, {
        [`${styles.showUsdValue}`]: Boolean(usdValue)
      })}
    >
      <NumericFormat
        getInputRef={ref}
        thousandSeparator=','
        thousandsGroupStyle='thousand'
        decimalSeparator='.'
        allowedDecimalSeparators={['.', ',']}
        inputMode='decimal'
        onValueChange={onValueChange}
        required={required}
        className={classNames(globals.input, styles.amountInput, {
          [globals.disabled]: Boolean(disabled)
        })}
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
        <span className={styles.amountHolderUsd}>
          <small data-testid={`tokenPrice_${tokenUsdPrice}`}>
            {usdValue !== '$0' ? <>≈ </> : <></>}
            {usdValue}
          </small>
          {InfoDustComponent}
        </span>
      )}
    </div>
  );
};
