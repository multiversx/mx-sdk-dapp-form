import { DECIMALS } from '@elrondnetwork/dapp-core/constants/index';
import { ZERO } from 'constants/index';
import { PartialTokenType } from 'types';

export function getTokenDetails({
  tokens,
  tokenId
}: {
  tokens: PartialTokenType[];
  tokenId: string;
}): PartialTokenType {
  const selectedToken = tokens.find(({ identifier }) => identifier === tokenId);
  const tokenDecimals = selectedToken ? selectedToken.decimals : DECIMALS;
  const tokenBalance = selectedToken?.balance || ZERO;

  return {
    ...selectedToken,
    decimals: tokenDecimals,
    identifier: selectedToken?.identifier || '',
    name: selectedToken?.name || '',
    ticker: selectedToken?.ticker || '',
    balance: tokenBalance
  };
}

export default getTokenDetails;
