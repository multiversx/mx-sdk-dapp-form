import React, { MouseEvent, useState } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DIGITS } from '@multiversx/sdk-dapp/constants';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { recommendGasPrice } from '@multiversx/sdk-dapp/hooks/transactions/helpers/recommendGasPrice';
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
import { formatAmount, getIsDisabled, parseAmount } from 'helpers';
import { formattedConfigGasPrice } from 'operations';
import { ValuesEnum } from 'types';

import { hasLeadingZeroes } from '../AmountSelect/components/AmountInput/helpers';
import styles from '../styles.module.scss';
import { PpuOptionType } from './gasPrice.types';

const GAS_PRICE_MODIFIER_FIELD = 'gasPriceModifier';
const EMPTY_PPU = 0;

const getFormattedGasPrice = (newGasPrice: string) => {
  const formattedGasPrice = formatAmount({
    input: String(newGasPrice),
    decimals: DECIMALS,
    showLastNonZeroDecimal: true,
    digits: DIGITS
  });
  return formattedGasPrice;
};

export const GasPrice = () => {
  const { networkConfig } = useNetworkConfigContext();
  const { gasInfo, formInfo, dataFieldInfo } = useSendFormContext();
  const { readonly } = formInfo;
  const { egldLabel, ppuForGasPrice } = networkConfig;

  const {
    gasPrice,
    gasLimit,
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

  const getRecommendedGasPrice = (ppu: PpuOptionType['value'] = EMPTY_PPU) => {
    return recommendGasPrice({
      ppu,
      transactionDataLength: dataFieldInfo.data.length,
      transactionGasLimit: Number(gasLimit)
    }).toString();
  };

  const handlePpuClick = (ppu: PpuOptionType['value']) => () => {
    if (ppu === EMPTY_PPU) {
      return onResetGasPrice();
    }

    const newGasPrice = getRecommendedGasPrice(ppu);

    const formattedGasPrice = getFormattedGasPrice(newGasPrice);

    onChangeGasPrice(formattedGasPrice, true);
  };

  const fastGasPrice = getRecommendedGasPrice(ppuForGasPrice?.fast);

  const fasterGasPrice = getRecommendedGasPrice(ppuForGasPrice?.faster);

  const areRadiosEnabled = new BigNumber(fastGasPrice).isGreaterThan(
    parseAmount(initialGasPrice)
  );

  const isFast = ppuForGasPrice
    ? gasPrice === getFormattedGasPrice(fastGasPrice)
    : false;

  const isFaster = ppuForGasPrice
    ? gasPrice === getFormattedGasPrice(fasterGasPrice)
    : false;

  const ppuOptions: PpuOptionType[] = [
    {
      label: 'Standard',
      isChecked: gasPrice === initialGasPrice,
      value: EMPTY_PPU
    },
    {
      label: 'Fast',
      isChecked: areRadiosEnabled && isFast,
      value: ppuForGasPrice?.fast ?? EMPTY_PPU
    },
    {
      label: 'Faster',
      isChecked: areRadiosEnabled && isFaster,
      value: ppuForGasPrice?.faster ?? EMPTY_PPU
    }
  ];

  return (
    <div className={styles.gas}>
      <div className={styles.heading}>
        <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
          Gas Price (per Gas Unit)
        </label>

        {ppuForGasPrice && areRadiosEnabled && (
          <div className={styles.gasMultipliers}>
            {ppuOptions.map((ppuOption) => (
              <div
                key={ppuOption.label}
                onClick={handlePpuClick(ppuOption.value)}
                className={classNames(styles.gasMultiplier, {
                  [styles.checked]: ppuOption.isChecked
                })}
              >
                <input
                  type='radio'
                  name={GAS_PRICE_MODIFIER_FIELD}
                  disabled={!areRadiosEnabled}
                  value={ppuOption.value}
                  className={styles.gasMultiplierInput}
                  checked={ppuOption.isChecked}
                  onChange={handlePpuClick(ppuOption.value)}
                  id={`${GAS_PRICE_MODIFIER_FIELD}-${ppuOption.value}`}
                />

                <label
                  className={styles.gasMultiplierLabel}
                  htmlFor={`${GAS_PRICE_MODIFIER_FIELD}-${ppuOption.value}`}
                >
                  {ppuOption.label}
                </label>
              </div>
            ))}
          </div>
        )}
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
