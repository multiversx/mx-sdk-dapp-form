import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import { TransactionSummary, TransactionSummaryPropsType } from './components';
import styles from './components/confirmScreen.module.scss';

export type ConfirmScreenPropsType = TransactionSummaryPropsType &
  WithClassnameType;

export const ConfirmScreen = (props: ConfirmScreenPropsType) => {
  return (
    <div
      className={classNames(styles.confirm, props.className)}
      data-testid='confirmScreen'
    >
      <TransactionSummary {...props} />
    </div>
  );
};
