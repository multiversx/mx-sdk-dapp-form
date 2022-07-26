import React, { ChangeEvent, useEffect, useState } from 'react';
import { decimals } from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';

import styles from './styles.module.scss';

export const AmountSlider = () => {
  const {
    amountInfo: { onChange, maxAmountMinusDust, amount }
  } = useSendFormContext();

  const [range, setRange] = useState(0);
  const breakpoints = [0, 25, 50, 75, 100];

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
  }, [amount]);

  return (
    <div className={styles.amountSlider}>
      <div className={styles.amountSliderRange}>
        <input
          className={styles.amountSliderInput}
          name='amountSlider'
          type='range'
          min={0}
          max={100}
          value={range}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange(Number(event.target.value))
          }
        />

        <span
          className={styles.amountSliderThumb}
          style={{ left: `${range}%` }}
        >
          <strong
            className={classNames(styles.amountSliderThumbPercentage, {
              [styles.hidden]: breakpoints.includes(range)
            })}
          >
            {range}%
          </strong>
        </span>

        <div
          className={styles.amountSliderCompletion}
          style={{ width: `${range}%` }}
        ></div>

        {breakpoints.map((breakpoint) => (
          <div
            key={`breakpoint-${breakpoint}`}
            style={{ left: `${breakpoint}%` }}
            className={classNames(styles.amountSliderBreakpoint, {
              [styles.completed]: breakpoint <= range
            })}
          >
            <span
              onClick={() => handleChange(breakpoint)}
              className={classNames(styles.amountSliderPercentage, {
                [styles.exact]: breakpoint === range
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
