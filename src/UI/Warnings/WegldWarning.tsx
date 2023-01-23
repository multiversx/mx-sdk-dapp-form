import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import { getWegldIdForChainId } from 'apiCalls';
import { WEGLD_MESSAGE } from 'constants/index';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import styles from './styles.module.scss';

export interface WegldWarningPropsType extends WithClassnameType {
  tokenId: string;
}

export const WegldWarning = ({ className, tokenId }: WegldWarningPropsType) => {
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const wegldId = getWegldIdForChainId(chainId);

  if (wegldId !== tokenId) {
    return null;
  }

  return (
    <div className={classNames(styles.canTransferWarning, className)}>
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
