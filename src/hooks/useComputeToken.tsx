import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { getAccountToken } from 'apiRequests';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  cachedTokensSelector,
  egldLabelSelector,
  formSelector,
  tokensSelector,
  useAccountSelector
} from 'redux/selectors';
import getIdentifierType from 'logic/validation/getIdentifierType';
import { TokenType } from 'types';

export function useComputeToken() {
  const egldLabel = useSelector(egldLabelSelector);

  const { tokenId: formTokenId, active: prefilledForm } =
    useSelector(formSelector);
  const tokens = useAccountSelector(cachedTokensSelector); // TODO: change naming and make all data available
  const { status: tokensStatus } = useSelector(tokensSelector);
  const { address } = useGetAccountInfo();
  const tokensFetched = tokensStatus === 'idle';

  const [computedTokenId, setComputedTokenId] = React.useState<string>(
    formTokenId || egldLabel
  );
  const [tokenFound, setTokenFound] = React.useState<boolean>();
  const [computedTokens, setComputedTokens] = React.useState<TokenType[]>();

  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const searchParams = Object.fromEntries(urlSearchParams);
  const searchParamToken = searchParams.token;

  const returnValues = ({
    tokenId,
    tokenData,
    tokenExtracted
  }: {
    tokenId: string;
    tokenData: TokenType[];
    tokenExtracted: boolean;
  }) => {
    setComputedTokenId(tokenId);
    setComputedTokens(tokenData);
    setTokenFound(tokenExtracted);
  };

  const getSingleToken = (tokenId: string) => {
    getAccountToken({ address, token: tokenId })
      .then(({ data: tokenData }) => {
        const filteredTokens = tokenData
          ? tokens.filter((t) => t.identifier !== tokenData.identifier)
          : tokens;
        returnValues({
          tokenId,
          tokenData: [...filteredTokens, tokenData],
          tokenExtracted: Boolean(tokenData)
        });
      })
      .catch((err) => {
        returnValues({
          tokenId,
          tokenData: [],
          tokenExtracted: false
        });
      });
  };

  const computeToken = () => {
    const identifier = formTokenId || searchParamToken;
    const { isEsdt, isNft } = getIdentifierType(identifier);

    if (!isEsdt) {
      return returnValues({
        tokenId: isNft ? identifier : egldLabel,
        tokenData: tokens,
        tokenExtracted: true
      });
    }
    if (prefilledForm) {
      return getSingleToken(identifier);
    }
    if (searchParamToken != null) {
      return getSingleToken(identifier);
    }
  };

  React.useEffect(computeToken, [tokensFetched, search]);

  return {
    computedTokenId,
    computedTokens,
    tokenFound
  };
}

export default useComputeToken;
