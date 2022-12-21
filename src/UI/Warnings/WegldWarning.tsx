import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getWegldIdForChainId } from 'apiCalls';
import { WEGLD_MESSAGE } from 'constants/index';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import styles from './styles.module.scss';

export const WegldWarning = ({ tokenId }: { tokenId: string }) => {
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const wegldId = getWegldIdForChainId(chainId);

  if (wegldId !== tokenId) {
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
