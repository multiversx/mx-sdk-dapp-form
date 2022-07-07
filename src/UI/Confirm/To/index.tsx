import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.module.scss';

const To = ({
  label = 'To',
  receiver,
  scamReport
}: {
  label?: string;
  receiver: string;
  scamReport?: ReactNode | string;
}) => (
  <div className={styles.to}>
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

export default To;
