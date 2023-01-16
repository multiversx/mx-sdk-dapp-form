import { useNetworkConfigContext } from 'contexts';
import React from 'react';
import { PartialTokenType } from 'types';
import './tokenSymbol.module.scss';

export const TokenSymbol = ({ token }: { token?: PartialTokenType }) => {
  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();

  return <>{token?.ticker === egldLabel ? egldLabel : token?.ticker}</>;
};
