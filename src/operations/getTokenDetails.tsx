import { denomination } from 'constants/index';
import { TokenType } from 'types';

export interface GetTokenDetailsReturnType {
  tokenDenomination: number;
  tokenBalance: string;
  tokenLabel: string;
  tokenAvatar: string;
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
  const tokenBalance = selectedToken ? selectedToken.balance : '0';
  const tokenLabel = selectedToken ? selectedToken.name : '';
  const tokenAvatar = selectedToken
    ? selectedToken.assets?.svgUrl || selectedToken.assets?.pngUrl || ''
    : '';

  return { tokenDenomination, tokenBalance, tokenLabel, tokenAvatar };
}

export default getTokenDetails;
