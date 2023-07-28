import React, { useEffect } from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import { FormTestIdsEnum } from 'constants/dataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { TransactionSummary, TransactionSummaryPropsType } from './components';
import styles from './components/confirmScreen.module.scss';

export type ConfirmScreenPropsType = TransactionSummaryPropsType &
  WithClassnameType;

export const ConfirmScreen = (props: ConfirmScreenPropsType) => {
  const {
    formInfo: { setHasGuardianScreen }
  } = useSendFormContext();

  useEffect(() => {
    // in case Form is skipped on a prefilled transaction, and Guardian component is present,
    // allow setting guardian screen
    if (props.hasGuardianScreen) {
      setHasGuardianScreen(true);
    }
  }, []);

  return (
    <div
      className={classNames(styles.confirm, props.className)}
      data-testid={FormTestIdsEnum.confirmScreen}
    >
      <TransactionSummary {...props} />
    </div>
  );
};
