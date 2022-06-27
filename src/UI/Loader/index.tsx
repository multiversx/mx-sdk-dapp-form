import * as React from 'react';
import { PageState } from '@elrondnetwork/dapp-core/UI';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

export const Loader = () => {
  return (
    <PageState
      title='Loading...'
      icon={faSpinner}
      iconClass='text-primary fa-spin fast-spin'
      iconSize='5x'
      dataTestId='loader'
      className='m-auto pt-spacer'
    />
  );
};

export default Loader;
