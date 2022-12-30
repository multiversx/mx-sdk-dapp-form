import React, { ChangeEvent } from 'react';
import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export interface AmountSliderPropsType extends WithClassnameType {
  disabled?: boolean;
  percentageValue: number;
  onPercentageChange: (percentage: number) => void;
}

export const AmountSlider = ({
  disabled,
  percentageValue = 0,
  onPercentageChange,
  className
}: AmountSliderPropsType) => {
  const breakpoints = [0, 25, 50, 75, 100];
  const amountSliderField = 'amountSlider';

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
          value={String(percentageValue)}
          className={classNames(styles.amountSliderInput, {
            [styles.disabled]: disabled
          })}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onPercentageChange(Number(event.target.value));
          }}
        />

        <span
          style={{ left: `${percentageValue}%` }}
          className={classNames(styles.amountSliderThumb, {
            [styles.disabled]: disabled
          })}
        >
          <strong
            className={classNames(styles.amountSliderThumbPercentage, {
              [styles.hidden]: breakpoints.includes(percentageValue)
            })}
          >
            {Math.round(percentageValue)}%
          </strong>
        </span>

        <div
          style={{ width: `${percentageValue}%` }}
          className={classNames(styles.amountSliderCompletion, {
            [styles.disabled]: disabled
          })}
        />

        {breakpoints.map((breakpoint) => (
          <span
            onClick={() => onPercentageChange(breakpoint)}
            key={`breakpoint-${breakpoint}`}
            style={{ left: `${breakpoint}%` }}
            className={classNames(styles.amountSliderBreakpoint, {
              [styles.completed]: breakpoint <= percentageValue,
              [styles.disabled]: disabled
            })}
          />
        ))}

        {breakpoints.map((breakpoint) => (
          <span
            style={{ left: `${breakpoint}%` }}
            key={`breakpoint-${breakpoint}`}
            onClick={() => onPercentageChange(breakpoint)}
            className={classNames(styles.amountSliderPercentage, {
              [styles.exact]: breakpoint === percentageValue,
              [styles.disabled]: disabled
            })}
          >
            {breakpoint}%
          </span>
        ))}
      </div>
    </div>
  );
};
