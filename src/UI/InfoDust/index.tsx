import * as React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { minDust } from 'constants/index';
import { faInfoCircle } from 'optionalPackages/fortawesome-free-solid-svg-icons';
import { FontAwesomeIcon } from 'optionalPackages/react-fontawesome';

export const InfoDust = () => {
  return (
    <div className='info-dust'>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => (
          <Tooltip id='info-dust-tooltip' {...props}>
            A minimal amount of{' '}
            <DappUI.Denominate value={minDust} decimals={3} /> has been left in
            the account in order to allow you to make future smart contract
            requests.
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
