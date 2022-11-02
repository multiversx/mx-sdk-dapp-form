import {
  ACCOUNTS_ENDPOINT,
  COLLECTIONS_ENDPOINT,
  NFTS_ENDPOINT
} from '@elrondnetwork/dapp-core/apiCalls/endpoints';
import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { NftEnumType, PartialMetaEsdtType, PartialNftType } from 'types';
import { FetchTokensArgumentsType, GetTokensType } from './tokens';

const maxCount = 1000;
const tokenPayloadSize = 100;

export async function getMetaEsdts({
  address,
  size,
  from,
  search
}: GetTokensType & {
  from?: number;
  size?: number;
}) {
  const params = new URLSearchParams({
    ...(from != null && size != null
      ? { from: String(from), size: String(size) }
      : {}),
    ...(search ? { search } : {})
  }).toString();

  const apiConfig = await getApiConfig();
  return axios.get<PartialMetaEsdtType[]>(
    `/${ACCOUNTS_ENDPOINT}/${address}/${NFTS_ENDPOINT}?${params}&type=${NftEnumType.MetaESDT}`,
    apiConfig
  );
}

export async function getMetaEsdtsCount({ address, search }: GetTokensType) {
  const params = new URLSearchParams({
    ...(search ? { search } : {})
  }).toString();

  const apiConfig = await getApiConfig();
  return axios.get<number>(
    `/${ACCOUNTS_ENDPOINT}/${address}/${NFTS_ENDPOINT}/count?${params}&type=${NftEnumType.MetaESDT}`,
    apiConfig
  );
}

export async function fetchMetaEsdts({
  address,
  page = 1,
  search,
  size
}: FetchTokensArgumentsType) {
  const params: {
    address: string;
    search?: string;
    from?: number;
    size?: number;
  } = {
    address,
    search
  };
  if (size != null) {
    params.from = (page - 1) * tokenPayloadSize;
    params.size = tokenPayloadSize;
  }

  const { data: newTokens } = await getMetaEsdts(params);
  return newTokens;
}

export async function fetchAllMetaEsdts(address: string) {
  const tokens = [];
  let hasMoreTokens = true;
  let page = 1;
  while (hasMoreTokens) {
    try {
      const data = await fetchMetaEsdts({ address, size: maxCount, page });
      //no more tokens on server
      if (data == null || data?.length === 0) {
        hasMoreTokens = false;
        break;
      }

      tokens.push(...data);
      if (data.length != tokenPayloadSize) {
        //the server returned less than max size, meaning these are the last tokens
        hasMoreTokens = false;
        break;
      }

      page++;
    } catch (err) {
      console.log(err);
      hasMoreTokens = false;
    }
  }
  return uniqBy(tokens, (t) => t.identifier);
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
