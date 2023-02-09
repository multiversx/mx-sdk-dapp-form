import { ApiConfigType, getToken } from 'apiCalls';
import { ZERO } from 'constants/index';
import { formatAmount } from 'helpers';

export const emptyToken = {
  tokenData: null,
  tokenAmount: ZERO,
  tokenFound: false
};

export async function getDataToken(
  {
    tokenId,
    parsedTokenAmount: parsedTokenAmount
  }: {
    tokenId: string;
    parsedTokenAmount: string;
  },
  apiConfig: ApiConfigType
) {
  if (!tokenId) {
    return emptyToken;
  }

  try {
    const { data } = await getToken(tokenId, apiConfig);
    const { decimals } = data;
    const formattedAmount = formatAmount({
      input: parsedTokenAmount,
      decimals,
      digits: decimals,
      addCommas: false,
      showLastNonZeroDecimal: true
    });

    return {
      tokenData: data,
      tokenAmount: formattedAmount,
      tokenFound: true
    };
  } catch (e) {
    return emptyToken;
  }
}
export default getDataToken;
