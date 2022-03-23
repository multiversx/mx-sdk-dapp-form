import * as React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { Trans, useTranslation } from 'react-i18next';

export const Loader = () => {
  const { t: c } = useTranslation(['common']);
  return (
    <DappUI.PageState
      title={<Trans t={c}>Loading...</Trans>}
      icon={faSpinner}
      iconClass='text-primary fa-spin fast-spin'
      iconSize='5x'
      dataTestId='loader'
      className='m-auto pt-spacer'
    />
  );
};

export default Loader;
