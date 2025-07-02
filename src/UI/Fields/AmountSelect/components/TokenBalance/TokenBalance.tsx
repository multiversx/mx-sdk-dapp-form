import React from 'react';
import classNames from 'classnames';
import { WithClassnameType } from 'types';

import { OptionType } from '../TokenSelect';
import styles from './tokenBalance.module.scss';

export interface TokenBalancePropsType extends WithClassnameType {
  label?: string;
  value?: string;
  token?: OptionType['token'];
  'data-value'?: string; // used for testing
}

export const TokenBalance = ({
  label,
  value,
  className,
  token,
  'data-testid': dataTestId,
  'data-value': dataValue
}: TokenBalancePropsType) => {
  return (
    <div
      data-testid={dataTestId}
      data-value={dataValue}
      className={classNames(styles.balance, className)}
    >
      <span className={styles.label}>{label}: </span>
      <span className={styles.value}>{value}</span> {token?.ticker}
    </div>
  );
};
