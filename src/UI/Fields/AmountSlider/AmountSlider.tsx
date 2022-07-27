import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';

import styles from './styles.module.scss';

export const AmountSlider = () => {
  const {
    formInfo: { readonly },
    amountInfo: { amountRange, onSetAmountPercentage }
  } = useSendFormContext();

  const breakpoints = [0, 25, 50, 75, 100];
  const disabled = getIsDisabled(ValuesEnum.amountSlider, readonly);

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
          value={amountRange}
          className={classNames(styles.amountSliderInput, {
            [styles.disabled]: disabled
          })}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onSetAmountPercentage(Number(event.target.value))
          }
        />

        <span
          style={{ left: `${amountRange}%` }}
          className={classNames(styles.amountSliderThumb, {
            [styles.disabled]: disabled
          })}
        ></span>

        <div
          style={{ width: `${amountRange}%` }}
          className={classNames(styles.amountSliderCompletion, {
            [styles.disabled]: disabled
          })}
        ></div>

        {breakpoints.map((breakpoint) => (
          <div
            key={`breakpoint-${breakpoint}`}
            style={{ left: `${breakpoint}%` }}
            className={classNames(styles.amountSliderBreakpoint, {
              [styles.completed]: breakpoint <= amountRange,
              [styles.disabled]: disabled
            })}
          >
            <span
              onClick={() => onSetAmountPercentage(breakpoint)}
              className={classNames(styles.amountSliderPercentage, {
                [styles.exact]: breakpoint === amountRange,
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
