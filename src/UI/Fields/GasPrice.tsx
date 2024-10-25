import React from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { NumberFormatValues, NumericFormat } from 'react-number-format';
import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { formattedConfigGasPrice } from 'operations';

import { ValuesEnum } from 'types';
import { hasLeadingZeroes } from './AmountSelect/components/AmountInput/helpers';
import styles from './styles.module.scss';

export const GasPrice = () => {
  const { gasInfo, formInfo } = useSendFormContext();

  const isAllowed = ({ value, floatValue }: NumberFormatValues) => {
    const defaultConditions = !floatValue || !BigNumber(floatValue).isNaN();

    return defaultConditions && !hasLeadingZeroes(value);
  };

  const {
    gasPrice,
    gasPriceError,
    isGasPriceInvalid,
    onChangeGasPrice,
    onBlurGasPrice,
    onResetGasPrice
  } = gasInfo;
  const { readonly } = formInfo;

  const showUndoButton = gasPrice !== formattedConfigGasPrice && !readonly;
  const isDisabled = readonly === true;

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles.wrapper}>
        <NumericFormat
          allowedDecimalSeparators={['.', ',']}
          autoComplete='off'
          data-testid={ValuesEnum.gasPrice}
          decimalSeparator='.'
          disabled={isDisabled}
          id={ValuesEnum.gasPrice}
          inputMode='decimal'
          isAllowed={isAllowed}
          name={ValuesEnum.gasPrice}
          onBlur={onBlurGasPrice}
          onChange={(e) => onChangeGasPrice(e, true)}
          required
          thousandSeparator=','
          thousandsGroupStyle='thousand'
          value={gasPrice}
          valueIsNumericString
          allowNegative={false}
          className={classNames(globals.input, {
            [globals.invalid]: isGasPriceInvalid,
            [globals.disabled]: isDisabled
          })}
        />

        {showUndoButton && (
          <span
            className={classNames(styles.undo, {
              [styles.disabled]: isDisabled
            })}
          >
            <button onClick={onResetGasPrice} className={styles.reset}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </span>
        )}
      </div>

      {isGasPriceInvalid && (
        <div className={globals.error}>{gasPriceError}</div>
      )}
    </div>
  );
};
