import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import styles from './tokenBalance.module.scss';

export interface TokenBalancePropsType extends WithClassnameType {
  label?: string;
  value?: string;
  'data-value'?: string; // used for testing
}

export const TokenBalance = ({
  label,
  value,
  className,
  'data-testid': dataTestId,
  'data-value': dataValue
}: TokenBalancePropsType) => {
  return (
    <div
      data-testid={dataTestId}
      data-value={dataValue}
      className={classNames(styles.balance, className)}
    >
      <span>{label}:</span>
      {value}
    </div>
  );
};
