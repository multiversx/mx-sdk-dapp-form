import { decimals, denomination } from 'constants/index';
import { TokenType } from 'types';

export interface GetTokenDetailsReturnType {
  tokenDenomination: number;
  tokenDecimals: number;
  tokenBalance: string;
  tokenLabel: string;
  tokenAvatar: string;
  tokenIdentifier?: string;
  tokenTicker?: string;
}

export function getTokenDetails({
  tokens,
  tokenId
}: {
  tokens: TokenType[];
  tokenId: string;
}): GetTokenDetailsReturnType {
  const selectedToken = tokens.find(({ identifier }) => identifier === tokenId);
  const tokenDenomination = selectedToken
    ? selectedToken.decimals
    : denomination;
  const tokenDecimals = selectedToken?.decimals || decimals;
  const tokenBalance = selectedToken?.balance || '0';
  const tokenLabel = selectedToken?.name || '';
  const tokenAvatar =
    selectedToken?.assets?.svgUrl || selectedToken?.assets?.pngUrl || '';

  return {
    tokenDenomination,
    tokenDecimals,
    tokenBalance,
    tokenLabel,
    tokenAvatar,
    tokenIdentifier: selectedToken?.identifier,
    tokenTicker: selectedToken?.ticker
  };
}

export default getTokenDetails;
