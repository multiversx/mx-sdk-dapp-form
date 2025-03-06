import React, { MouseEvent, useState } from 'react';
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

import { hasLeadingZeroes } from '../AmountSelect/components/AmountInput/helpers';
import styles from '../styles.module.scss';

const GAS_PRICE_MODIFIER_FIELD = 'gasPriceModifier';

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

  const [initialGasPrice] = useState(gasPrice);

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

  const handleSpeedChange = (modifier: 1 | 2 | 3) => () => {
    const newGasPrice = new BigNumber(initialGasPrice).multipliedBy(modifier);
    onChangeGasPrice(newGasPrice.toString(10), true);
  };

  const isNormal = gasPrice === initialGasPrice;
  const isFast =
    gasPrice === new BigNumber(initialGasPrice).multipliedBy(2).toString(10);
  const isFaster =
    gasPrice === new BigNumber(initialGasPrice).multipliedBy(3).toString(10);

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price (per Gas Unit)
      </label>

      <div className={styles.wrapper}>
        <div className={styles.inputContainer}>
          <NumericFormat
            allowedDecimalSeparators={['.', ',']}
            autoComplete='off'
            data-testid={ValuesEnum.gasPrice}
            allowLeadingZeros={false}
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

          <div className={styles.speedSelector}>
            <div
              className={classNames(styles.speedOption, {
                [styles.selected]: isNormal
              })}
              onClick={onResetGasPrice}
            >
              <input
                type='radio'
                name={GAS_PRICE_MODIFIER_FIELD}
                value={1}
                checked={isNormal}
                onChange={onResetGasPrice}
              />
              Normal
            </div>
            <div
              className={classNames(styles.speedOption, {
                [styles.selected]: isFast
              })}
              onClick={handleSpeedChange(2)}
            >
              <input
                type='radio'
                name={GAS_PRICE_MODIFIER_FIELD}
                value={2}
                checked={isFast}
                onChange={handleSpeedChange(2)}
              />
              Fast
            </div>
            <div
              className={classNames(styles.speedOption, {
                [styles.selected]: isFaster
              })}
              onClick={handleSpeedChange(3)}
            >
              <input
                type='radio'
                name={GAS_PRICE_MODIFIER_FIELD}
                value={3}
                checked={isFaster}
                onChange={handleSpeedChange(3)}
              />
              Faster
            </div>
          </div>
        </div>

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
        <div
          className={globals.error}
          data-testid={`${ValuesEnum.gasPrice}Error`}
        >
          {gasPriceError}
        </div>
      )}
    </div>
  );
};
