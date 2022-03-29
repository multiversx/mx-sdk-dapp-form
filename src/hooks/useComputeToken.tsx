import { useEffect, useState } from 'react';

import { getAccountToken } from 'apiCalls';
import { TokenType } from 'types';
import getIdentifierType from '../validation/getIdentifierType';

interface UseComputeTokenType {
  formTokenId?: string;
  egldLabel: string;
  address: string;
}

export function useComputeToken({
  formTokenId,
  egldLabel,
  address
}: UseComputeTokenType) {
  const [state, setState] = useState<{
    tokenId: string;
    computedTokens: TokenType[];
    tokenExtracted?: boolean;
  }>({
    tokenId: formTokenId || egldLabel,
    computedTokens: []
  });

  const search = window?.location?.search;

  const urlSearchParams = new URLSearchParams(search);
  const searchParams = Object.fromEntries(urlSearchParams);
  const searchParamToken = searchParams.token;

  const getSingleToken = (tokenId: string) => {
    getAccountToken({ address, token: tokenId })
      .then(({ data: tokenData }) => {
        setState({
          tokenId,
          computedTokens: [tokenData],
          tokenExtracted: Boolean(tokenData)
        });
      })
      .catch(() => {
        setState({
          tokenId,
          computedTokens: [],
          tokenExtracted: false
        });
      });
  };

  const computeToken = () => {
    const identifier = formTokenId || searchParamToken;
    const { isEsdt, isNft } = getIdentifierType(identifier);

    if (isEsdt && identifier) {
      return getSingleToken(identifier);
    }

    setState({
      tokenId: isNft ? identifier : egldLabel,
      computedTokens: [],
      tokenExtracted: true
    });
  };

  useEffect(computeToken, [search]);

  return {
    computedTokenId: state.tokenId,
    computedTokens: state.computedTokens,
    tokenFound: state.tokenExtracted
  };
}

export default useComputeToken;
