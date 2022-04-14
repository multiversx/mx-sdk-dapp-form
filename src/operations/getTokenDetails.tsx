import { constants } from '@elrondnetwork/dapp-core';
import { TokenType } from 'types';

export function getTokenDetails({
  tokens,
  tokenId
}: {
  tokens: TokenType[];
  tokenId: string;
}): TokenType {
  const selectedToken = tokens.find(({ identifier }) => identifier === tokenId);
  const tokenDenomination = selectedToken
    ? selectedToken.decimals
    : constants.denomination;
  const tokenBalance = selectedToken?.balance || '0';

  return {
    ...selectedToken,
    decimals: tokenDenomination,
    identifier: selectedToken?.identifier || '',
    name: selectedToken?.name || '',
    ticker: selectedToken?.ticker || '',
    balance: tokenBalance
  };
}

export default getTokenDetails;
