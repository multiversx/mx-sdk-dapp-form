import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { TokenType } from 'types';

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
    ...(search ? { search } : {})
  }).toString();

  const apiConfig = await getApiConfig();
  return axios.get<TokenType[]>(
    `/accounts/${address}/tokens?${params}`,
    apiConfig
  );
}

export async function getTokensCount({ address, search }: GetTokensType) {
  const params = new URLSearchParams({
    ...(search ? { search } : {})
  }).toString();

  const apiConfig = await getApiConfig();
  return axios.get<number>(
    `/accounts/${address}/tokens/count?${params}`,
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
  return axios.get<TokenType>(`/accounts/${address}/tokens/${token}`, config);
}

export async function getToken(token: string) {
  const apiConfig = await getApiConfig();
  return axios.get<TokenType>(`/tokens/${token}`, apiConfig);
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

  const { data: newTokens } = await getTokens(params);
  return newTokens;
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
      const newTokens: TokenType[] = data.map((item: TokenType) => ({
        ...item,
        denomination: item.decimals
      }));
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
