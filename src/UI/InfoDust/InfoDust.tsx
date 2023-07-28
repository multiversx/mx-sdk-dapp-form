import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { MIN_DUST, FormTestIdsEnum } from 'constants/index';
import styles from './styles.module.scss';

export const InfoDust = ({ egldLabel }: { egldLabel: string }) => (
  <div className={styles.infoDust}>
    <Tooltip
      anchorId='info-dust'
      place='top'
      noArrow
      delayHide={400}
      delayShow={250}
      className={styles.infoDustTooltip}
    >
      A minimal amount of{' '}
      <FormatAmount egldLabel={egldLabel} value={MIN_DUST} digits={3} /> has
      been left in the account in order to allow you to make future smart
      contract requests.
    </Tooltip>

    <div
      data-tip
      id='info-dust'
      data-for='info-dust'
      data-testid={FormTestIdsEnum.infoDust}
      className={styles.infoDustTrigger}
    >
      <FontAwesomeIcon icon={faInfoCircle} className='i-icon' />
    </div>
  </div>
);
