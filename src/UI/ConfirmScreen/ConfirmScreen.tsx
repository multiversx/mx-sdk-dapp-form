import React, { useEffect } from 'react';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { WithClassnameType } from 'types';

import { TransactionSummary, TransactionSummaryPropsType } from './components';

export type ConfirmScreenPropsType = TransactionSummaryPropsType &
  WithClassnameType;

export const ConfirmScreenComponent = (
  props: ConfirmScreenPropsType & WithStylesImportType
) => {
  const { hasGuardianScreen, className, styles } = props;
  const {
    formInfo: { setHasGuardianScreen }
  } = useSendFormContext();

  useEffect(() => {
    // in case Form is skipped on a prefilled transaction, and Guardian component is present,
    // allow setting guardian screen
    if (hasGuardianScreen) {
      setHasGuardianScreen(true);
    }
  }, []);

  return (
    <div
      className={classNames(styles?.confirm, className)}
      data-testid={FormDataTestIdsEnum.confirmScreen}
    >
      <TransactionSummary {...props} />
    </div>
  );
};

export const ConfirmScreen = withStyles(ConfirmScreenComponent, {
  ssrStyles: () => import('UI/ConfirmScreen/styles.scss'),
  clientStyles: () => require('UI/ConfirmScreen/styles.scss').default
});
