import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import { useFormContext } from 'contexts';
import styles from 'UI/ConfirmScreen/components/confirmScreen.module.scss';
import { GuardianForm } from './components';

export const GuardianScreen = ({ className }: WithClassnameType) => {
  const { setIsGuardianScreenVisible } = useFormContext();

  const onGuardianScreenClose = () => {
    setIsGuardianScreenVisible(false);
  };

  return (
    <div
      className={classNames(styles.confirm, className)}
      data-testid='guardianScreen'
    >
      <GuardianForm onBack={onGuardianScreenClose} />
    </div>
  );
};
