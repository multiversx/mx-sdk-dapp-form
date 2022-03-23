import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';

const SendLoader = ({ title = 'Loading...' }: { title?: string }) => {
  return (
    <DappUI.PageState
      title={title}
      iconClass='fa-5x text-primary fa-spin fast-spin'
      icon={faSpinnerThird}
      className='m-auto empty pt-spacer'
    />
  );
};

export default SendLoader;
