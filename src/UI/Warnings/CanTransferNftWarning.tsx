import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CAN_TRANSFER_MESSAGE } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

export const CanTransferNftWarning = () => {
  const {
    tokensInfo: { allowedReceivers, nft }
  } = useSendFormContext();

  if (!nft || allowedReceivers == null) {
    return null;
  }

  return (
    <div className='row'>
      <div className='col-12'>
        <small
          className={'wegld-alert-warning align-items-center d-flex p-3'}
          role='alert'
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size='lg'
            className='wegld-alert-icon mr-2'
          />

          <div>
            <div className='font-weight-bold'>Warning</div>
            <div>{CAN_TRANSFER_MESSAGE}</div>
            <ul>
              {allowedReceivers?.map((receiver) => (
                <li key={receiver}>
                  <p style={{ wordBreak: 'break-all' }}>{receiver}</p>
                </li>
              ))}
            </ul>
          </div>
        </small>
      </div>
    </div>
  );
};
