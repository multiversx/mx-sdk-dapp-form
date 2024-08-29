import { ApiConfigType, getToken } from 'apiCalls';
import { ZERO } from 'constants/index';
import { formatAmount } from 'helpers';

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
  try {
    if (!tokenId) {
      return {
        tokenData: null,
        tokenAmount: ZERO,
        tokenFound: false
      };
    }

    const data = await getToken(tokenId, apiConfig);

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
      tokenFound: !Array.isArray(data) && data.identifier === tokenId
    };
  } catch (e) {
    return {
      tokenData: null,
      tokenAmount: ZERO,
      tokenFound: false
    };
  }
}
export default getDataToken;
