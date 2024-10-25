import React, { useState } from 'react';
import { faCheck, faPencil, faUndo } from '@fortawesome/free-solid-svg-icons';
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
  const [isDisabled, setIsDisabled] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const handleEnable = () => setIsDisabled(false);
  const handleConfirm = () => setIsConfirmed(true);
  const handleReset = () => {
    setIsDisabled(true);
    setIsConfirmed(false);
    onResetGasPrice();
  };

  const showUndoButton = gasPrice !== formattedConfigGasPrice && !readonly;
  const showEditButton = !readonly && !isConfirmed;

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
          disabled={Boolean(readonly || !isConfirmed)}
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

        {showEditButton && (
          <span
            className={classNames(styles.undo, {
              [styles.noSeparator]: true
            })}
          >
            <button
              onClick={isDisabled ? handleEnable : handleConfirm}
              className={styles.reset}
            >
              <FontAwesomeIcon icon={isDisabled ? faPencil : faCheck} />
            </button>
          </span>
        )}

        {showUndoButton && (
          <span
            className={classNames(styles.undo, {
              [styles.disabled]: isDisabled
            })}
          >
            <button onClick={handleReset} className={styles.reset}>
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
