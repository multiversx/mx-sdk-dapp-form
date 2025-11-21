import BigNumber from 'bignumber.js';
import {
  ApiConfigType,
  getGlobalNftByIdentifier,
  getNftByAddressAndIdentifier
} from 'apiCalls';
import { bech32 } from 'helpers/transformations';
import { extractNftFromData } from './extractNftFromData';
import { SearchNFTPropsType } from './searchNft.types';
import { ComputedNftType } from './types';

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
          receiver: bech32.encode(receiver),
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
