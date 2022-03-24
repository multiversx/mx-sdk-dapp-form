import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { faSpinner } from 'optionalPackages/fortawesome-free-solid-svg-icons';

const SendLoader = ({ title = 'Loading...' }: { title?: string }) => {
  return (
    <DappUI.PageState
      title={title}
      iconClass='fa-5x text-primary fa-spin fast-spin'
      icon={faSpinner}
      className='m-auto empty pt-spacer'
    />
  );
};

export default SendLoader;
