import { useSendFormContext, useNetworkConfigContext } from 'contexts';
import React from 'react';
import './tokenSymbol.module.scss';

export const TokenSymbol = () => {
  const { tokensInfo } = useSendFormContext();

  const { tokenDetails } = tokensInfo;

  const { identifier } = tokenDetails;

  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();

  return <>{identifier === egldLabel ? egldLabel : identifier}</>;
};
