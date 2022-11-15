import React from 'react';
import { Trim } from '@elrondnetwork/dapp-core/UI/Trim';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormikContext } from 'formik';
import { CAN_TRANSFER_MESSAGE } from 'constants/index';
import { ExtendedValuesType } from 'types';

import styles from './styles.module.scss';

export const CanTransferNftWarning = () => {
  const {
    values: { nft }
  } = useFormikContext<ExtendedValuesType>();

  if (!nft || nft.allowedReceivers == null) {
    return null;
  }

  return (
    <div className={styles.canTransferWarning} data-testid='canTransferWarning'>
      <small role='alert' className={styles.wegldAlertWarning}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={styles.wegldAlertIcon}
          size='lg'
        />

        <div className={styles.canTransferWarningWrapper}>
          <div className={styles.canTransferWarningLabel}>Warning</div>
          <div className={styles.canTransferWarningMessage}>
            {CAN_TRANSFER_MESSAGE}
          </div>

          <ul className={styles.canTransferWarningList}>
            {nft.allowedReceivers?.map((receiver) => (
              <li key={receiver}>
                <Trim text={receiver} />
              </li>
            ))}
          </ul>
        </div>
      </small>
    </div>
  );
};
