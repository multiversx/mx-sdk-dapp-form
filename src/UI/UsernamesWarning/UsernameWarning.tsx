import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LEDGER_WITH_USERNAMES_MINIMUM_VERSION } from '@multiversx/sdk-dapp/constants';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export const UsernameWarning = ({ className }: WithClassnameType) => (
  <div className={classNames(styles.usernamesWarning, className)}>
    <div className={styles.usernamesWarningHeading}>
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className={styles.usernamesWarningIcon}
        size='lg'
      />

      <div className={styles.usernamesWarningTitle}>
        <div className={styles.usernamesWarningLabel}>Warning!</div>
        <div className={styles.usernamesWarningMessage}>
          You need at least MultiversX app version{' '}
          {LEDGER_WITH_USERNAMES_MINIMUM_VERSION} to use herotags.
        </div>
      </div>
    </div>
  </div>
);
