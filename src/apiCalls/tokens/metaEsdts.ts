import { COLLECTIONS_ENDPOINT } from '@multiversx/sdk-dapp/out/apiCalls/endpoints';
import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { NftEnumType, PartialNftType } from 'types';

export async function getAllowedReceivers(
  nft: PartialNftType,
  apiConfig?: ApiConfigType
) {
  if (nft.type !== NftEnumType.MetaESDT) {
    return null;
  }

  const config = apiConfig || (await getApiConfig());

  if (!config) {
    return null;
  }

  try {
    const { data: collectionData } = await axios.get<{
      canTransfer?: boolean;
      roles: {
        address: string;
        canTransfer?: boolean;
      }[];
    }>(`/${COLLECTIONS_ENDPOINT}/${nft.collection}`, config);

    const isTransferForbidden = collectionData?.canTransfer === false;
    const allowedReceivers = isTransferForbidden
      ? collectionData?.roles
          .map(({ address, canTransfer }) => {
            if (canTransfer) {
              return address;
            }
            return '';
          })
          .filter((el) => Boolean(el))
      : null;
    return allowedReceivers;
  } catch (error) {
    console.error(
      `Unable to get canTransfer information for collection ${nft.collection}`,
      error
    );
    return null;
  }
}
