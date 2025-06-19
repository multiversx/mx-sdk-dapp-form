import { getIdentifierType } from '@multiversx/sdk-dapp/out/utils/validation/getIdentifierType';
import { searchNftByIdentifier } from './getSearchParamNft';
import { searchNft } from './searchNft';
import { ComputedNftType } from './types';

const emptyData = {
  receiver: '',
  quantity: ''
};

interface GetNftParamsType {
  data?: string;
  address: string;
  identifier?: string;
}

export const getNft = async ({
  data,
  address,
  identifier
}: GetNftParamsType): Promise<ComputedNftType | null> => {
  if (data) {
    return await searchNft({ data, address });
  }
  const { isNft } = getIdentifierType(identifier);
  if (identifier && isNft) {
    const nft = await searchNftByIdentifier({
      identifier,
      address
    });
    if (nft) {
      return {
        ...emptyData,
        nft
      };
    }

    return null;
  }
  return null;
};
