import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ValuesEnum } from 'types';

import styles from './styles.module.scss';

export const AmountSlider = () => {
  const {
    formInfo: { readonly, hiddenFields, checkInvalid },
    amountInfo: { amountRange, onSetAmountPercentage }
  } = useSendFormContext();

  const breakpoints = [0, 25, 50, 75, 100];
  const isHidden =
    hiddenFields?.includes(ValuesEnum.amount) &&
    !checkInvalid(ValuesEnum.amount);

  const disabled =
    typeof readonly === 'boolean'
      ? readonly
      : readonly?.includes(ValuesEnum.amount);

  return (
    <div
      className={classNames(styles.amountSlider, {
        [styles.amountSliderHidden]: isHidden
      })}
    >
      <div className={styles.amountSliderRange}>
        <input
          name='amountSlider'
          id='amountSlider'
          data-testid='amountSlider'
          type='range'
          disabled={disabled}
          min={0}
          max={100}
          value={amountRange}
          className={classNames(styles.amountSliderInput, {
            [styles.disabled]: disabled
          })}
          onChange={(event: ChangeEvent<any>) =>
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
