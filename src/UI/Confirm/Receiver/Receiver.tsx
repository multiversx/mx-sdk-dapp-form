import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ACCOUNTS_ENDPOINT } from '@multiversx/sdk-dapp/apiCalls/endpoints';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI/ExplorerLink';
import classNames from 'classnames';
import globals from 'assets/sass/globals.module.scss';
import styles from './styles.module.scss';

export const {
  default: MultiversXIconSimple
} = require('../../../assets/icons/mx-icon-simple.svg');

export interface ReceiverPropsType {
  label?: string;
  receiver: string;
  receiverUsername?: string;
  scamReport?: ReactNode;
}

export const Receiver = ({
  label = 'Receiver',
  receiver,
  scamReport,
  receiverUsername
}: ReceiverPropsType) => {
  const hasUsername = Boolean(receiverUsername);
  const receiverValue = receiverUsername ?? receiver;

  return (
    <div className={styles.confirmReceiver}>
      <span className={globals.label}>{label}</span>

      {receiverValue && (
        <span
          className={classNames(styles.value, { [styles.shrunk]: hasUsername })}
          data-testid='confirmReceiver'
        >
          {hasUsername && <MultiversXIconSimple className={styles.icon} />}
          {receiverValue}

          {hasUsername && (
            <ExplorerLink
              page={`/${ACCOUNTS_ENDPOINT}/${receiver}`}
              className={styles.explorer}
            />
          )}
        </span>
      )}

      {hasUsername && <span className={styles.subValue}>{receiver}</span>}

      {scamReport && (
        <div className={styles.scam}>
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={styles.icon}
            />
            <small data-testid='confirmScamReport'>{scamReport}</small>
          </span>
        </div>
      )}
    </div>
  );
};
