import { NftEnumType } from '@multiversx/sdk-dapp/types/tokens.types';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { ApiConfigType, getNftByAddressAndIdentifier } from 'apiCalls';
import { getAllowedReceiversData } from 'contexts/TokensContext/utils';

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
    let nft = await getNftByAddressAndIdentifier(
      {
        address,
        identifier
      },
      apiConfig
    );
    if (nft?.type === NftEnumType.MetaESDT) {
      const allowedReceivers = await getAllowedReceiversData(nft);
      nft = {
        ...nft,
        allowedReceivers
      };
    }
    return nft;
  } catch (e) {
    console.log(e);
  }
  return null;
}
