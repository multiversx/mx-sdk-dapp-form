import React, { useEffect } from 'react';
import classNames from 'classnames';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { WithClassnameType } from 'types';
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
      data-testid={FormDataTestIdsEnum.confirmScreen}
    >
      <TransactionSummary {...props} />
    </div>
  );
};
