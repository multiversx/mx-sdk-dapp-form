import React, { MouseEvent, useState } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DIGITS, DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import { recommendGasPrice } from '@multiversx/sdk-dapp-utils/out/helpers/recommendGasPrice';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import {
  NumberFormatValues,
  NumericFormat,
  OnValueChange
} from 'react-number-format';

import globals from 'assets/sass/globals.module.scss';
import { useAccountContext, useNetworkConfigContext } from 'contexts';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { formattedConfigGasPrice } from 'operations';
import { ValuesEnum } from 'types';

import { hasLeadingZeroes } from '../AmountSelect/components/AmountInput/helpers';
import styles from '../styles.module.scss';
import { PpuOptionType } from './gasPrice.types';
import { PpuOptionLabelEnum } from './gasPrice.types';

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
  const { egldLabel, gasStationMetadata } = networkConfig;
  const { shard } = useAccountContext();

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
    onChangeGasPrice({
      newValue: event.value,
      shouldValidate: true
    });
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

    onChangeGasPrice({
      newValue: formattedGasPrice,
      shouldValidate: true
    });
  };

  const fastPpu = gasStationMetadata ? gasStationMetadata[shard]?.fast : 0;
  const fasterPpu = gasStationMetadata ? gasStationMetadata[shard]?.faster : 0;

  const fastGasPrice = getRecommendedGasPrice(fastPpu);

  const fasterGasPrice = getRecommendedGasPrice(fasterPpu);

  const isFastHigherThanInitial = new BigNumber(fastGasPrice).isGreaterThan(
    parseAmount(initialGasPrice)
  );

  const isFasterHigherThanInitial = new BigNumber(fasterGasPrice).isGreaterThan(
    parseAmount(initialGasPrice)
  );

  const areRadiosEnabled = isFasterHigherThanInitial || isFastHigherThanInitial;

  const isFast = gasStationMetadata
    ? gasPrice === getFormattedGasPrice(fastGasPrice)
    : false;

  const isFaster = gasStationMetadata
    ? gasPrice === getFormattedGasPrice(fasterGasPrice)
    : false;

  const ppuOptions: PpuOptionType[] = [
    {
      label: PpuOptionLabelEnum.Standard,
      isChecked: gasPrice === initialGasPrice,
      value: EMPTY_PPU
    },
    ...(isFastHigherThanInitial
      ? [
          {
            label: PpuOptionLabelEnum.Fast,
            isChecked: areRadiosEnabled && isFast,
            value: fastPpu ?? EMPTY_PPU
          }
        ]
      : []),
    ...(isFasterHigherThanInitial
      ? [
          {
            label: PpuOptionLabelEnum.Faster,
            isChecked: areRadiosEnabled && isFaster,
            value: fasterPpu ?? EMPTY_PPU
          }
        ]
      : [])
  ];

  return (
    <div className={styles.gas}>
      <div className={styles.heading}>
        <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
          Gas Price (per Gas Unit)
        </label>

        {gasStationMetadata && areRadiosEnabled && (
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
