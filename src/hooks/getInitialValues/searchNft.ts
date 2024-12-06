import { Address } from '@multiversx/sdk-core';
import BigNumber from 'bignumber.js';
import {
  ApiConfigType,
  getGlobalNftByIdentifier,
  getNftByAddressAndIdentifier
} from 'apiCalls';
import { extractNftFromData } from './extractNftFromData';
import { ComputedNftType } from './types';

interface ExistingNftType {
  collection: string;
  nonce: string;
  quantity: string;
  receiver: string;
}

const searchNftById = async (
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) => {
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
};

export interface SearchNFTPropsType {
  data: string;
  address: string;
  nft?: ExistingNftType;
}

export const searchNft = async (
  props: SearchNFTPropsType,
  apiConfig?: ApiConfigType
): Promise<ComputedNftType | null> => {
  const { address, nft } = props;
  const extractedNft = extractNftFromData(props);

  try {
    if (extractedNft) {
      const { collection, nonce, quantity, receiver } = extractedNft;
      const identifier = `${collection}-${nonce}`;
      const apiNft = await searchNftById({ identifier, address }, apiConfig);
      if (apiNft) {
        return {
          receiver: Address.newFromBech32(receiver).toBech32(),
          nft: apiNft,
          quantity: nft ? quantity : new BigNumber(quantity, 16).toString(10)
        };
      }
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};
