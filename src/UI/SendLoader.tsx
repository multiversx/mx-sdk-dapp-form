import React from 'react';
import * as DappUI from '@elrondnetwork/dapp-core/UI';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const SendLoader = ({ title = 'Loading...' }: { title?: string }) => {
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
