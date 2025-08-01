import {
  ACCOUNTS_ENDPOINT,
  NFTS_ENDPOINT
} from '@multiversx/sdk-dapp/out/apiCalls/endpoints';
import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { PartialNftType } from 'types';

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

    if (!config) {
      return null;
    }

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

    if (!config) {
      return null;
    }

    const { data }: { data: PartialNftType } = await axios.get(
      `/${NFTS_ENDPOINT}/${identifier}`,
      config
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}
