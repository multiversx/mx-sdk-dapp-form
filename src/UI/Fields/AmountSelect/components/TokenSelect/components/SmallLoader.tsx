import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const SmallLoader = ({
  show,
  color
}: {
  show: boolean;
  color?: string;
}) => {
  return show ? (
    <div className='d-flex'>
      <FontAwesomeIcon
        icon={faSpinner}
        className={`fa-spin fast-spin ${color ? color : 'text-primary'}`}
      />
    </div>
  ) : null;
};
