import React, { ChangeEvent, useEffect, useState } from 'react';
import { decimals } from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';

import styles from './styles.module.scss';

export const AmountSlider = () => {
  const {
    formInfo: { readonly },
    amountInfo: { onChange, maxAmountMinusDust, amount }
  } = useSendFormContext();

  const [range, setRange] = useState(0);
  const breakpoints = [0, 25, 50, 75, 100];
  const disabled = getIsDisabled(ValuesEnum.amountSlider, readonly);

  const handleChange = (percentage: number, callChangeEvent = true) => {
    const total = maxAmountMinusDust;
    const big = new BigNumber(total).times(percentage).dividedBy(100);
    const value = denominate({ input: nominate(String(big)), decimals });

    setRange(percentage <= 100 ? percentage : 100);

    if (callChangeEvent) {
      onChange(value);
    }
  };

  useEffect(() => {
    const total = new BigNumber(nominate(maxAmountMinusDust));
    const difference = new BigNumber(nominate(amount));
    const percentage = 100 / Number(String(total.dividedBy(difference)));

    handleChange(Math.round(percentage), false);
  }, [amount, maxAmountMinusDust]);

  return (
    <div className={styles.amountSlider}>
      <div className={styles.amountSliderRange}>
        <input
          name={ValuesEnum.amountSlider}
          id={ValuesEnum.amountSlider}
          data-testid={ValuesEnum.amountSlider}
          type='range'
          disabled={disabled}
          min={0}
          max={100}
          value={range}
          className={classNames(styles.amountSliderInput, {
            [styles.disabled]: disabled
          })}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange(Number(event.target.value))
          }
        />

        <span
          style={{ left: `${range}%` }}
          className={classNames(styles.amountSliderThumb, {
            [styles.disabled]: disabled
          })}
        ></span>

        <div
          style={{ width: `${range}%` }}
          className={classNames(styles.amountSliderCompletion, {
            [styles.disabled]: disabled
          })}
        ></div>

        {breakpoints.map((breakpoint) => (
          <div
            key={`breakpoint-${breakpoint}`}
            style={{ left: `${breakpoint}%` }}
            className={classNames(styles.amountSliderBreakpoint, {
              [styles.completed]: breakpoint <= range,
              [styles.disabled]: disabled
            })}
          >
            <span
              onClick={() => handleChange(breakpoint)}
              className={classNames(styles.amountSliderPercentage, {
                [styles.exact]: breakpoint === range,
                [styles.disabled]: disabled
              })}
            >
              {breakpoint}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
