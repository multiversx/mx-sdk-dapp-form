import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import globals from 'assets/sass/globals.module.scss';
import { useUICustomizationContext } from 'contexts/UICustomization';
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
}: ReceiverPropsType) => {
  const {
    fields: {
      receiver: { label: contextLabel }
    }
  } = useUICustomizationContext();

  return (
    <div className={styles.receiver}>
      <span className={globals.label}>{contextLabel || label}</span>
      {receiver && <span className={globals.value}>{receiver}</span>}

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
};
