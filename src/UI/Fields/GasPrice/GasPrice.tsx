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
import { GasMultiplerOptionType } from './gasPrice.types';

const GAS_PRICE_MODIFIER_FIELD = 'gasPriceModifier';
const DEFAULT_GAS_PRICE_MULTIPLIER = 1;

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

  const gasBigNumber = new BigNumber(initialGasPrice);
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

  const isFast = gasPrice === gasBigNumber.multipliedBy(2).toString(10);
  const isFaster = gasPrice === gasBigNumber.multipliedBy(3).toString(10);

  const handleGasMultiplierClick =
    (gasMultiplier: GasMultiplerOptionType['value']) => () => {
      const newGasPrice = gasBigNumber.multipliedBy(gasMultiplier).toString(10);

      if (gasMultiplier === DEFAULT_GAS_PRICE_MULTIPLIER) {
        onResetGasPrice();
      } else {
        onChangeGasPrice(newGasPrice, true);
      }
    };

  const gasMultiplierOptions: GasMultiplerOptionType[] = [
    {
      label: 'Standard',
      isChecked: gasPrice === initialGasPrice,
      value: DEFAULT_GAS_PRICE_MULTIPLIER
    },
    { label: 'Fast', isChecked: isFast, value: 2 },
    { label: 'Faster', isChecked: isFaster, value: 3 }
  ];

  return (
    <div className={styles.gas}>
      <div className={styles.heading}>
        <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
          Gas Price (per Gas Unit)
        </label>

        <div className={styles.gasMultipliers}>
          {gasMultiplierOptions.map((gasMultiplierOption) => (
            <div
              key={gasMultiplierOption.label}
              onClick={handleGasMultiplierClick(gasMultiplierOption.value)}
              className={classNames(styles.gasMultiplier, {
                [styles.checked]: gasMultiplierOption.isChecked
              })}
            >
              <input
                type='radio'
                name={GAS_PRICE_MODIFIER_FIELD}
                value={gasMultiplierOption.value}
                className={styles.gasMultiplierInput}
                checked={gasMultiplierOption.isChecked}
                onChange={handleGasMultiplierClick(gasMultiplierOption.value)}
                id={`${GAS_PRICE_MODIFIER_FIELD}-${gasMultiplierOption.value}`}
              />

              <label
                className={styles.gasMultiplierLabel}
                htmlFor={`${GAS_PRICE_MODIFIER_FIELD}-${gasMultiplierOption.value}`}
              >
                {gasMultiplierOption.label}
              </label>
            </div>
          ))}
        </div>
      </div>

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
