import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WEGLD_ID, WEGLD_MESSAGE } from 'constants/index';

import styles from './styles.module.scss';

export const WegldWarning = ({ tokenId }: { tokenId: string }) => {
  if (WEGLD_ID !== tokenId) {
    return null;
  }

  return (
    <div className={styles.canTransferWarning}>
      <small role='alert' className={styles.wegldAlertWarning}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={styles.wegldAlertIcon}
          size='lg'
        />

        <div className={styles.canTransferWarningWrapper}>
          <div className={styles.canTransferWarningLabel}>Warning</div>
          <div className={styles.canTransferWarningMessage}>
            {WEGLD_MESSAGE}
          </div>
        </div>
      </small>
    </div>
  );
};
