import * as React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { minDust } from 'constants/index';

export const InfoDust = () => {
  const { t } = useTranslation(['send']);
  return (
    <div className='info-dust'>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => (
          <Tooltip id='info-dust-tooltip' {...props}>
            <Trans t={t}>
              A minimal amount of{' '}
              <DappUI.Denominate value={minDust} decimals={3} /> has been left
              in the account in order to allow you to make future smart contract
              requests.
            </Trans>
          </Tooltip>
        )}
      >
        <a
          href='/#'
          onClick={(e) => {
            e.preventDefault();
          }}
          data-testid='infoDust'
        >
          <FontAwesomeIcon icon={faInfoCircle} className='i-icon' />
        </a>
      </OverlayTrigger>
    </div>
  );
};

export default InfoDust;
