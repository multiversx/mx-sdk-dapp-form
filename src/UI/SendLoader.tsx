import React from 'react';
import { PageState } from '@elrondnetwork/dapp-core/UI/PageState';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const SendLoader = ({ title = 'Loading...' }: { title?: string }) => {
  return (
    <PageState
      title={title}
      iconClass='fa-5x text-primary fa-spin fast-spin'
      icon={faSpinner}
      className='m-auto empty pt-spacer'
    />
  );
};

export default SendLoader;
