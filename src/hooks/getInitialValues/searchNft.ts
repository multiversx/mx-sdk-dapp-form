import { Address } from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';
import {
  ApiConfigType,
  getAllowedReceivers,
  getGlobalNftByIdentifier,
  getNftByAddressAndIdentifier
} from 'apiCalls';
import extractNftFromData from './extractNftFromData';
import { ComputedNftType } from './types';

interface ExistingNftType {
  collection: string;
  nonce: string;
  quantity: string;
  receiver: string;
}

async function searchdNftById(
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) {
  const { address, identifier } = props;
  try {
    return await getNftByAddressAndIdentifier(
      {
        address,
        identifier
      },
      apiConfig
    );
  } catch {
    return await getGlobalNftByIdentifier(identifier, apiConfig);
  }
}

export async function searchNft(
  props: {
    data: string;
    address: string;
    nft?: ExistingNftType;
  },
  apiConfig?: ApiConfigType
): Promise<ComputedNftType | null> {
  const { data, address, nft } = props;
  const extractedNft = extractNftFromData(data, nft);
  try {
    if (extractedNft) {
      const { collection, nonce, quantity, receiver } = extractedNft;
      const identifier = `${collection}-${nonce}`;
      const apiNft = await searchdNftById({ identifier, address }, apiConfig);
      if (apiNft) {
        const allowedReceivers = await getAllowedReceivers(apiNft);
        return {
          receiver: new Address(receiver).bech32(),
          nft: apiNft,
          allowedReceivers,
          quantity: nft ? quantity : new BigNumber(quantity, 16).toString(10)
        };
      }
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

export default searchNft;
