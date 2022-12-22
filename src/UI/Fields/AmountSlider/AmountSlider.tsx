import React, { ChangeEvent } from 'react';
import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';

import styles from './styles.module.scss';

export const AmountSlider = ({ className }: WithClassnameType) => {
  const {
    formInfo: { readonly },
    amountInfo: { amountRange, onSetAmountPercentage }
  } = useSendFormContext();

  const breakpoints = [0, 25, 50, 75, 100];

  const amountSliderField = 'amountSlider';

  const disabled = Boolean(readonly);

  return (
    <div className={classNames(styles.amountSlider, className)}>
      <div className={styles.amountSliderRange}>
        <input
          name={amountSliderField}
          id={amountSliderField}
          data-testid={amountSliderField}
          type='range'
          disabled={disabled}
          min={0}
          max={100}
          value={String(amountRange)}
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
        />

        <div
          style={{ width: `${amountRange}%` }}
          className={classNames(styles.amountSliderCompletion, {
            [styles.disabled]: disabled
          })}
        />

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
