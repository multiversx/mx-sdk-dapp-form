import {
  COLLECTIONS_ENDPOINT,
  ACCOUNTS_ENDPOINT,
  NFTS_ENDPOINT
} from '@elrondnetwork/dapp-core/apiCalls/endpoints';
import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { NftEnumType, PartialNftType } from 'types';

export interface GetNftByAddressAndIdentifierArgsType {
  address: string;
  identifier: string;
}

export async function getNftByAddressAndIdentifier(
  { address, identifier }: GetNftByAddressAndIdentifierArgsType,
  apiConfig?: ApiConfigType
) {
  try {
    const config = apiConfig || (await getApiConfig());
    const { data }: { data: PartialNftType } = await axios.get(
      `/${ACCOUNTS_ENDPOINT}/${address}/${NFTS_ENDPOINT}/${identifier}`,
      config
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}

export async function getGlobalNftByIdentifier(
  identifier: string,
  apiConfig?: ApiConfigType
) {
  try {
    const config = apiConfig || (await getApiConfig());
    const { data }: { data: PartialNftType } = await axios.get(
      `/${NFTS_ENDPOINT}/${identifier}`,
      config
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}

export async function getAllowedReceivers(
  nft: PartialNftType,
  apiConfig?: ApiConfigType
) {
  if (nft.type !== NftEnumType.MetaESDT) {
    return null;
  }

  const config = apiConfig || (await getApiConfig());
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
