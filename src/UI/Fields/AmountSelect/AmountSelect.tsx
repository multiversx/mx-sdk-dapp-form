import React from 'react';
import classNames from 'classnames';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { ExtendedValuesType, WithClassnameType } from 'types';
import styles from './amountSelect.module.scss';

import {
  AmountError,
  AmountErrorPropsType,
  AmountInput,
  AmountInputPropsType,
  MaxButton,
  MaxButtonPropsType,
  TokenBalance,
  TokenBalancePropsType,
  TokenSelect,
  TokenSelectPropsType
} from './components';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
  name: string;
  readonly?: ExtendedValuesType['readonly'];
  wrapperControlsClassName?: string;
  amountErrorProps: AmountErrorPropsType;
  tokenBalanceProps: TokenBalancePropsType;
  tokenSelectProps: TokenSelectPropsType;
  amountInputProps: AmountInputPropsType;
  maxButtonProps: MaxButtonPropsType;
}

export const AmountSelect = ({
  className,
  label,
  name,
  wrapperControlsClassName,
  tokenSelectProps,
  tokenBalanceProps,
  amountInputProps,
  amountErrorProps,
  maxButtonProps,
  readonly
}: AmountSelectPropsType) => (
  <div className={classNames(styles.amount, className)}>
    <div className={styles.label}>
      {label && (
        <label
          htmlFor={name}
          className={globals.label}
          data-testid={FormDataTestIdsEnum.amountLabel}
        >
          {label}
        </label>
      )}

      <TokenBalance {...tokenBalanceProps} />
    </div>

    <div
      className={classNames(styles.wrapper, wrapperControlsClassName, {
        [styles.error]:
          amountInputProps.isInvalid ||
          tokenSelectProps.isInvalid ||
          amountErrorProps.hasErrors,
        [styles.disabled]: readonly
      })}
    >
      <AmountInput {...amountInputProps} />

      <div
        className={classNames(
          styles.interaction,
          maxButtonProps.wrapperClassName
        )}
      >
        {maxButtonProps.isMaxButtonVisible && <MaxButton {...maxButtonProps} />}

        <div className={styles.select}>
          <TokenSelect {...tokenSelectProps} />
        </div>
      </div>
    </div>

    <AmountError {...amountErrorProps} />
  </div>
);
