import React, { MouseEvent } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import {
  NumberFormatValues,
  NumericFormat,
  OnValueChange
} from 'react-number-format';

import globals from 'assets/sass/globals.module.scss';
import { useNetworkConfigContext } from 'contexts';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { formattedConfigGasPrice } from 'operations';
import { ValuesEnum } from 'types';

import { hasLeadingZeroes } from './AmountSelect/components/AmountInput/helpers';
import styles from './styles.module.scss';

export const GasPrice = () => {
  const { networkConfig } = useNetworkConfigContext();
  const { gasInfo, formInfo } = useSendFormContext();
  const { readonly } = formInfo;
  const { egldLabel } = networkConfig;

  const {
    gasPrice,
    gasPriceError,
    isGasPriceInvalid,
    onChangeGasPrice,
    onBlurGasPrice,
    onResetGasPrice
  } = gasInfo;

  const showUndoButton = gasPrice !== formattedConfigGasPrice && !readonly;
  const isDisabled = getIsDisabled(ValuesEnum.gasPrice, readonly);

  const isAllowed = ({ value, floatValue }: NumberFormatValues) => {
    const defaultConditions = !floatValue || !BigNumber(floatValue).isNaN();
    return defaultConditions && !hasLeadingZeroes(value);
  };

  const handleResetGasPrice = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onResetGasPrice();
  };

  const handleValueChange: OnValueChange = (event) => {
    onChangeGasPrice(event.value, true);
  };

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price (per Gas Unit)
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
          onValueChange={handleValueChange}
          required
          suffix={` ${egldLabel}`}
          thousandSeparator=','
          thousandsGroupStyle='thousand'
          value={gasPrice}
          valueIsNumericString
          allowNegative={false}
          className={classNames(globals.input, styles.input, {
            [globals.disabled]: isDisabled,
            [globals.invalid]: isGasPriceInvalid,
            [styles.spaced]: showUndoButton
          })}
        />

        {showUndoButton && (
          <div className={styles.actions}>
            <div
              onClick={handleResetGasPrice}
              className={classNames(styles.action, {
                [styles.disabled]: isDisabled
              })}
            >
              <FontAwesomeIcon icon={faUndo} className={styles.icon} />
            </div>
          </div>
        )}
      </div>

      {isGasPriceInvalid && (
        <div className={globals.error}>{gasPriceError}</div>
      )}
    </div>
  );
};
