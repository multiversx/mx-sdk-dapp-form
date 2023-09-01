import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LEDGER_WITH_GUARDIANS_MINIMUM_VERSION } from '@multiversx/sdk-dapp/constants';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export const GuardiansWarning = ({ className }: WithClassnameType) => (
  <div className={classNames(styles.guardiansWarning, className)}>
    <div className={styles.guardiansWarningHeading}>
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className={styles.guardiansWarningIcon}
        size='lg'
      />

      <div className={styles.guardiansWarningTitle}>
        <div className={styles.guardiansWarningLabel}>Warning!</div>
        <div className={styles.guardiansWarningMessage}>
          You need at least MultiversX app version{' '}
          {LEDGER_WITH_GUARDIANS_MINIMUM_VERSION} to use Guardians.
        </div>
      </div>
    </div>
  </div>
);
