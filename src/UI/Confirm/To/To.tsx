import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.module.scss';

export const To = ({
  label = 'To',
  receiver,
  scamReport
}: {
  label?: string;
  receiver: string;
  scamReport?: ReactNode;
}) => (
  <div className={styles.confirmTo}>
    <span className={styles.confirmToLabel}>{label}</span>
    {receiver && <span className={styles.confirmToReceiver}>{receiver}</span>}

    {scamReport && (
      <div className={styles.confirmToScam}>
        <span>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.confirmToIcon}
          />
          <small>{scamReport}</small>
        </span>
      </div>
    )}
  </div>
);
