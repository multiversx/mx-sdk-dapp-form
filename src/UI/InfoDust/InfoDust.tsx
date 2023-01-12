import React from 'react';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';

import { MIN_DUST } from 'constants/index';
import styles from './styles.module.scss';

export const InfoDust = ({ egldLabel }: { egldLabel: string }) => (
  <div className={styles.infoDust}>
    <ReactTooltip
      effect='solid'
      id='info-dust'
      delayHide={400}
      delayShow={250}
      className={styles.infoDustTooltip}
      arrowColor='transparent'
    >
      A minimal amount of{' '}
      <FormatAmount egldLabel={egldLabel} value={MIN_DUST} digits={3} /> has
      been left in the account in order to allow you to make future smart
      contract requests.
    </ReactTooltip>

    <div
      data-tip
      data-for='info-dust'
      data-testid='infoDust'
      className={styles.infoDustTrigger}
    >
      <FontAwesomeIcon icon={faInfoCircle} className='i-icon' />
    </div>
  </div>
);
