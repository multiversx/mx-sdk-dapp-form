import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classNames from 'classnames';
import { getWegldIdForChainId } from 'apiCalls';
import { WEGLD_MESSAGE } from 'constants/index';
import { useNetworkConfigContext } from 'contexts';
import { WithClassnameType } from 'types';

import styles from './styles.module.scss';

export interface WEGLDWarningPropsType extends WithClassnameType {
  tokenId: string;
}

export const WEGLDWarning = (props: WEGLDWarningPropsType) => {
  const { tokenId, className } = props;
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const wegldId = getWegldIdForChainId(chainId);

  if (wegldId !== tokenId) {
    return null;
  }

  return (
    <div className={classNames(styles.wegldWarning, className)}>
      <div className={styles.wegldWarningHeading}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={styles.wegldWarningIcon}
          size='lg'
        />

        <div className={styles.wegldWarningTitle}>
          <div className={styles.wegldWarningLabel}>Warning!</div>
          <div className={styles.wegldWarningMessage}>{WEGLD_MESSAGE}</div>
        </div>
      </div>
    </div>
  );
};
