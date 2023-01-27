import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
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
  tokenSelectProps,
  tokenBalanceProps,
  amountInputProps,
  amountErrorProps,
  maxButtonProps
}: AmountSelectPropsType) => {
  return (
    <div className={classNames(styles.amount, className)}>
      <div className={styles.label}>
        {label && (
          <label htmlFor={name} className={globals.label}>
            {label}
          </label>
        )}

        <TokenBalance {...tokenBalanceProps} />
      </div>

      <div className={styles.wrapper}>
        <AmountInput {...amountInputProps} />

        <div className={styles.interaction}>
          {maxButtonProps.isMaxButtonVisible && (
            <MaxButton {...maxButtonProps} />
          )}

          <div className={styles.select}>
            <TokenSelect {...tokenSelectProps} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <AmountError {...amountErrorProps} />
      </div>
    </div>
  );
};
