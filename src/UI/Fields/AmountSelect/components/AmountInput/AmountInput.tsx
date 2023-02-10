import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

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
  usdPrice?: number;
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: (e: FocusEvent<any>) => void;
  onKeyDown?: () => void;
  onFocus?: () => void;
  onDebounceChange?: (amount: string) => void;
  InfoDustComponent?: JSX.Element;
}

const fiveHundredMs = 500;
const maxAcceptedAmount = 10000000000000; // 10 trillions

export const AmountInput = ({
  required,
  name,
  placeholder,
  value,
  disabled,
  usdPrice,
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
  const [usdValue, setUsdValue] = useState<string>();

  const debounceAmount = useImprovedDebounce(debounceValue, fiveHundredMs);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = removeCommas(event.target.value);
    const isBelowMax =
      stringIsFloat(newValue) &&
      BigNumber(parseFloat(newValue)).isLessThanOrEqualTo(maxAcceptedAmount);

    if (newValue === '' || isBelowMax) {
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
    if (!usdPrice || !value) {
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
      new BigNumber(parseFloat(amount) * (usdPrice ?? 0)).toString(10),
      2
    );

    setUsdValue(`$${newUsdValue}`);
  };

  const isAllowed = ({ floatValue }: NumberFormatValues) => {
    return (
      !floatValue ||
      BigNumber(floatValue).isLessThanOrEqualTo(maxAcceptedAmount)
    );
  };

  useEffect(() => {
    if (onDebounceChange) {
      onDebounceChange(debounceAmount.value);
    }
  }, [debounceAmount]);

  useEffect(updateUsdValue, [value, usdPrice]);

  return (
    <div
      className={classNames(styles.amountHolder, {
        [styles.showUsdValue]: Boolean(usdValue)
      })}
    >
      <NumericFormat
        getInputRef={ref}
        thousandSeparator=','
        thousandsGroupStyle='thousand'
        decimalSeparator='.'
        allowedDecimalSeparators={['.', ',']}
        inputMode='decimal'
        valueIsNumericString={true}
        isAllowed={isAllowed}
        required={required}
        data-testid={dataTestId || name}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={handleBlur}
        autoComplete='off'
        disabled={Boolean(disabled)}
        onFocus={onFocus}
        className={classNames(globals.input, styles.amountInput, {
          [globals.disabled]: Boolean(disabled)
        })}
      />

      {usdValue && (
        <span className={styles.amountHolderUsd}>
          <small data-testid={`tokenPrice_${usdPrice}`}>
            {usdValue !== '$0' ? <>≈ </> : <></>}
            {usdValue}
          </small>

          {InfoDustComponent}
        </span>
      )}
    </div>
  );
};
