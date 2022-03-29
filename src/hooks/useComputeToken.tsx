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
  const [computedTokenId, setComputedTokenId] = useState<string>(
    formTokenId || egldLabel
  );
  const [tokenFound, setTokenFound] = useState<boolean>();
  const [computedTokens, setComputedTokens] = useState<TokenType[]>();
  const search = window?.location?.search;

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
        returnValues({
          tokenId,
          tokenData: [tokenData],
          tokenExtracted: Boolean(tokenData)
        });
      })
      .catch(() => {
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

    if (isEsdt && identifier) {
      return getSingleToken(identifier);
    }

    return returnValues({
      tokenId: isNft ? identifier : egldLabel,
      tokenData: [],
      tokenExtracted: true
    });
  };

  useEffect(computeToken, [search]);

  return {
    computedTokenId,
    computedTokens,
    tokenFound
  };
}

export default useComputeToken;
