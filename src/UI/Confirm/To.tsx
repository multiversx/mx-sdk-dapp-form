import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const To = ({
  label = 'To',
  receiver,
  scamReport
}: {
  label?: string;
  receiver: string;
  scamReport?: React.ReactNode | string;
}) => (
  <div className='form-group'>
    <span className='form-label text-secondary d-block'>{label}</span>
    <span className='address text-break-all'>{receiver}</span>
    {scamReport && (
      <div className='text-warning'>
        <span>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className='text-warning mr-1'
          />
          <small>{scamReport}</small>
        </span>
      </div>
    )}
  </div>
);

export default To;
