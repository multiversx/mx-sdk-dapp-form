import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import BigNumber from 'bignumber.js';
import { maxAcceptedAmount } from 'config';
import NumberFormat from 'react-number-format';
import { removeCommas, roundAmount, isStringFloat } from 'utils';
import { useImprovedDebounce } from 'hooks';
import { ImprovedDebounceValueType } from 'types';

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

const AmountInput = ({
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
      isStringFloat(newValue) && parseFloat(newValue) <= maxAcceptedAmount;

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
    const isValid = value !== '' && isStringFloat(amount);

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
      <NumberFormat
        thousandSeparator={','}
        decimalSeparator={'.'}
        allowedDecimalSeparators={['.', ',']}
        inputMode='decimal'
        isNumericString={true}
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

export default AmountInput;
