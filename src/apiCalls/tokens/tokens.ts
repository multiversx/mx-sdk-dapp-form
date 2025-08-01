import {
  TOKENS_ENDPOINT,
  ACCOUNTS_ENDPOINT
} from '@multiversx/sdk-dapp/out/apiCalls/endpoints';
import { getPersistedToken } from '@multiversx/sdk-dapp/out/apiCalls/tokens/getPersistedToken';
import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { PartialMetaEsdtType, PartialTokenType } from 'types';

export interface GetTokensType {
  address: string;
  search?: string;
}

const maxCount = 1000;
const tokenPayloadSize = 100;

export async function getTokens({
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
    ...(search ? { search } : {}),
    includeMetaESDT: 'true'
  }).toString();

  const apiConfig = await getApiConfig();
  if (!apiConfig) {
    return null;
  }

  return axios.get<Array<PartialTokenType | PartialMetaEsdtType>>(
    `/${ACCOUNTS_ENDPOINT}/${address}/${TOKENS_ENDPOINT}?${params}`,
    apiConfig
  );
}

export async function getTokensCount({ address, search }: GetTokensType) {
  const params = new URLSearchParams({
    ...(search ? { search } : {}),
    includeMetaESDT: 'true'
  }).toString();

  const apiConfig = await getApiConfig();
  if (!apiConfig) {
    return null;
  }

  return axios.get<number>(
    `/${ACCOUNTS_ENDPOINT}/${address}/${TOKENS_ENDPOINT}/count?${params}`,
    apiConfig
  );
}

export async function getAccountToken(
  props: {
    address: string;
    token: string;
  },
  apiConfig?: ApiConfigType
) {
  const { address, token } = props;

  const config = apiConfig || (await getApiConfig());

  if (!config) {
    return null;
  }

  return axios.get<PartialTokenType>(
    `/${ACCOUNTS_ENDPOINT}/${address}/${TOKENS_ENDPOINT}/${token}`,
    config
  );
}

export async function getToken(token: string, apiConfig?: ApiConfigType) {
  return getPersistedToken<PartialTokenType>(
    `${apiConfig?.baseURL}/${TOKENS_ENDPOINT}/${token}`
  );
}

export interface FetchTokensArgumentsType {
  address: string;
  page?: number;
  search?: string;
  size?: number;
}

export async function fetchTokens({
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

  const response = await getTokens(params);

  if (!response) {
    return null;
  }

  return response.data;
}

export async function fetchAllTokens(address: string) {
  const tokens = [];
  let hasMoreTokens = true;
  let page = 1;
  while (hasMoreTokens) {
    try {
      const data = await fetchTokens({ address, size: maxCount, page });
      //no more tokens on server
      if (data == null || data?.length === 0) {
        hasMoreTokens = false;
        break;
      }
      const newTokens: PartialTokenType[] = data.map(
        (item: PartialTokenType) => ({
          ...item
        })
      );
      tokens.push(...newTokens);
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
