import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.module.scss';

export interface ReceiverPropsType {
  label?: string;
  receiver: string;
  scamReport?: ReactNode;
}

export const Receiver = ({
  label = 'Receiver',
  receiver,
  scamReport
}: ReceiverPropsType) => (
  <div className={styles.receiver}>
    <span className={styles.label}>{label}</span>
    {receiver && <span>{receiver}</span>}

    {scamReport && (
      <div className={styles.scam}>
        <span>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.icon}
          />
          <small>{scamReport}</small>
        </span>
      </div>
    )}
  </div>
);
