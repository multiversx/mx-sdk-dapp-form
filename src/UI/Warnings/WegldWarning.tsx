import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WEGLD_ID, WEGLD_MESSAGE } from 'constants/index';

export const WegldWarning = ({ tokenId }: { tokenId: string }) => {
  if (WEGLD_ID !== tokenId) {
    return null;
  }

  return (
    <div className='row'>
      <div className='col-12'>
        <small
          className='wegld-alert-warning align-items-center d-flex p-3'
          role='alert'
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size='lg'
            className='wegld-alert-icon mr-2'
          />

          <div>
            <div className='font-weight-bold'>Warning</div>
            <div>{WEGLD_MESSAGE} </div>
            <a
              {...{
                target: '_blank'
              }}
              className='d-none'
              href='https://elrond.com/'
            >
              Learn more
            </a>
          </div>
        </small>
      </div>
    </div>
  );
};
