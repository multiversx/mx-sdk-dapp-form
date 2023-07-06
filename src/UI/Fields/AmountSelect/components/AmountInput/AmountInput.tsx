import React, {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  memo,
  useEffect,
  useRef,
  useState
} from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation';

import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import globals from 'assets/sass/globals.module.scss';
import styles from './amountInput.module.scss';
import {
  ImprovedDebounceValueType,
  removeCommas,
  roundAmount,
  useImprovedDebounce
} from './helpers';

export interface AmountInputPropsType extends WithClassnameType {
  'data-testid'?: string;
  InfoDustComponent?: JSX.Element;
  disabled?: boolean;
  error?: string;
  handleBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  name: string;
  onDebounceChange?: (amount: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readonly?: boolean;
  required: boolean;
  usdPrice?: number;
  value: string;
}

const fiveHundredMs = 500;
const maxAcceptedAmount = 10_000_000_000_000; // 10 trillions

const AmountComponent = ({
  'data-testid': dataTestId,
  InfoDustComponent,
  disabled,
  handleBlur,
  handleChange,
  name,
  onDebounceChange,
  onFocus,
  onKeyDown,
  placeholder,
  required,
  usdPrice,
  value,
  className
}: AmountInputPropsType) => {
  const ref = useRef(null);

  const [inputValue, setInputValue] = useState<string>();
  const [edited, setEdited] = useState(false);

  const [debounceValue, setDebounceValue] = useState<ImprovedDebounceValueType>(
    { value, count: 0 }
  );
  const [usdValue, setUsdValue] = useState<string>();

  const debounceAmount = useImprovedDebounce(debounceValue, fiveHundredMs);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    setEdited(true);
    const newValue = removeCommas(event.target.value);
    const isBelowMax =
      BigNumber(newValue).isLessThanOrEqualTo(maxAcceptedAmount);

    if (newValue === '' || isBelowMax) {
      setInputValue(newValue);
      event.target.value = newValue;
      handleChange(event);

      if (onDebounceChange) {
        const newDebounceValue = {
          value: newValue,
          count: debounceValue.count + 1
        };
        setDebounceValue(newDebounceValue);
      }
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
    if (onDebounceChange && edited) {
      setEdited(false);
      onDebounceChange(debounceAmount.value);
    }
  }, [debounceAmount]);

  useEffect(updateUsdValue, [value, usdPrice]);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div
      ref={ref}
      className={classNames(
        styles.amountHolder,
        { [styles.showUsdValue]: Boolean(usdValue) },
        className
      )}
    >
      <NumericFormat
        allowedDecimalSeparators={['.', ',']}
        autoComplete='off'
        className={classNames(globals.input, styles.amountInput, {
          [globals.disabled]: Boolean(disabled)
        })}
        data-testid={dataTestId || name}
        decimalSeparator='.'
        disabled={Boolean(disabled)}
        id={name}
        inputMode='decimal'
        isAllowed={isAllowed}
        name={name}
        onBlur={handleBlur}
        onChange={handleOnChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        thousandSeparator=','
        thousandsGroupStyle='thousand'
        value={inputValue}
        valueIsNumericString
        allowNegative={false}
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

export const AmountInput = memo(
  AmountComponent,
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.usdPrice === nextProps.usdPrice
);
