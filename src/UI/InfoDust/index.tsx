import React from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';

import { minDust } from 'constants/index';
import styles from './styles.module.scss';

export const InfoDust = ({ egldLabel }: { egldLabel: string }) => (
  <div className={styles.info}>
    <ReactTooltip
      effect='solid'
      id='info-dust'
      delayHide={400}
      delayShow={250}
      className={styles.tooltip}
      arrowColor='transparent'
    >
      A minimal amount of{' '}
      <Denominate egldLabel={egldLabel} value={minDust} decimals={3} /> has been
      left in the account in order to allow you to make future smart contract
      requests.
    </ReactTooltip>

    <div
      data-tip
      data-for='info-dust'
      data-testid='infoDust'
      className={styles.trigger}
    >
      <FontAwesomeIcon icon={faInfoCircle} className='i-icon' />
    </div>
  </div>
);

export default InfoDust;
