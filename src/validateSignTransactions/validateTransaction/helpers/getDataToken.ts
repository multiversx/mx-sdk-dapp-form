import { ApiConfigType, getToken } from 'apiCalls';
import { ZERO } from 'constants/index';
import { denominate } from 'helpers';

export async function getDataToken(
  {
    tokenId,
    nominatedTokenAmount
  }: {
    tokenId: string;
    nominatedTokenAmount: string;
  },
  apiConfig: ApiConfigType
) {
  try {
    const { data } = await getToken(tokenId, apiConfig);
    const denominatedAmount = denominate({
      input: nominatedTokenAmount,
      decimals: data.decimals,
      digits: data.decimals,
      addCommas: false,
      showLastNonZeroDecimal: true
    });

    return {
      tokenData: data,
      tokenAmount: denominatedAmount,
      tokenFound: true
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
