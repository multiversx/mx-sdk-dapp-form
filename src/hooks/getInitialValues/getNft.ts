import { getIdentifierType } from '@elrondnetwork/dapp-core/utils/validation/getIdentifierType';
import { searchNftByIdentifier } from './getSearchParamNft';
import searchNft from './searchNft';
import { ComputedNftType } from './types';

const emptyData = {
  receiver: '',
  quantity: ''
};

export async function getNft(props: {
  data?: string;
  address: string;
  identifier?: string;
}): Promise<ComputedNftType | null> {
  const { data, address, identifier } = props;
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
}

export default getNft;
