import { getIdentifierType } from '@elrondnetwork/dapp-core/utils/validation/getIdentifierType';
import { ApiConfigType, getNftByAddressAndIdentifier } from 'apiCalls';

export async function searchNftByIdentifier(
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) {
  const { address, identifier } = props;
  const { isNft } = getIdentifierType(identifier);
  if (!isNft) {
    return null;
  }
  try {
    const nft = await getNftByAddressAndIdentifier(
      {
        address,
        identifier
      },
      apiConfig
    );
    return nft;
  } catch (e) {
    console.log(e);
  }
  return null;
}
