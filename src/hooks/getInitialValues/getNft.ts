import { searchNftByIdentifier, getSearchParamNft } from './getSearchParamNft';
import searchNft from './searchNft';
import { ComputedNftType } from './types';

const emptyData = {
  receiver: '',
  quantity: ''
};

export async function getNft(props: {
  data?: string;
  address: string;
  tokenId?: string;
}): Promise<ComputedNftType | null> {
  const { data, address, tokenId } = props;
  if (data) {
    return await searchNft({ data, address });
  }
  if (tokenId) {
    const nft = await searchNftByIdentifier({ identifier: tokenId, address });
    return nft ? { ...emptyData, nft } : null;
  }
  const nft = await getSearchParamNft(address);
  return nft ? { ...emptyData, nft } : null;
}

export default getNft;
