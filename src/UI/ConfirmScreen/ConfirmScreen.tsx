import React, { useState } from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import {
  GuardianScreen,
  TransactionSummary,
  TransactionSummaryPropsType
} from './components';
import styles from './components/confirmScreen.module.scss';

export type ConfirmScreenPropsType = TransactionSummaryPropsType &
  WithClassnameType;

export const ConfirmScreen = (props: ConfirmScreenPropsType) => {
  const [isGuardianScreenVisible, setIsGuardianScreenVisible] = useState(false);

  const onGuardianScreenClose = () => {
    setIsGuardianScreenVisible(false);
  };

  const onGuardianScreenShow = () => {
    setIsGuardianScreenVisible(true);
  };

  return (
    <div
      className={classNames(styles.confirm, props.className)}
      data-testid='confirmScreen'
    >
      {isGuardianScreenVisible ? (
        <GuardianScreen onBack={onGuardianScreenClose} />
      ) : (
        <TransactionSummary {...props} onNext={onGuardianScreenShow} />
      )}
    </div>
  );
};
