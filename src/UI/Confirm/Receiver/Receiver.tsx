import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import globals from 'assets/sass/globals.module.scss';
import { TestIdsEnum } from 'constants/testIds';
import styles from './styles.module.scss';

export interface ReceiverPropsType {
  label?: string;
  receiver: string;
  receiverUsername?: string;
  scamReport?: ReactNode;
}

export const Receiver = ({
  label = 'Receiver',
  receiver,
  receiverUsername,
  scamReport
}: ReceiverPropsType) => (
  <div className={styles.receiver}>
    <span className={globals.label}>{label}</span>

    {receiver && (
      <span className={styles.value} data-testid={TestIdsEnum.confirmReceiver}>
        {receiver}
      </span>
    )}

    {receiverUsername && (
      <span
        className={styles.value}
        data-testid={TestIdsEnum.confirmReceiverUsername}
      >
        {receiverUsername}
      </span>
    )}

    {scamReport && (
      <div className={styles.scam}>
        <span>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.icon}
          />
          <small data-testid={TestIdsEnum.confirmScamReport}>
            {scamReport}
          </small>
        </span>
      </div>
    )}
  </div>
);
