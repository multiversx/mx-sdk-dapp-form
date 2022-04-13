import { denominate } from '@elrondnetwork/dapp-core';
import { ApiConfigType, getToken } from 'apiCalls';

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
    const amount = denominate({
      input: nominatedTokenAmount,
      denomination: data.decimals,
      decimals: data.decimals,
      addCommas: false,
      showLastNonZeroDecimal: true
    });

    return {
      tokenData: data,
      tokenAmount: amount,
      tokenFound: true
    };
  } catch (e) {}

  return {
    tokenData: null,
    tokenAmount: '0',
    tokenFound: false
  };
}
export default getDataToken;
