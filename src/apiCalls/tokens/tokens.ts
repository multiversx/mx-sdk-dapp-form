import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { ApiPropsType } from 'apiCalls/types';
import { TokenType } from 'types';

export interface GetTokensType {
  address: string;
  search?: string;
}

const maxCount = 1000;
const tokenPayloadSize = 100;

export const getTokens =
  (props: ApiPropsType) =>
  ({
    address,
    size,
    from,
    search
  }: GetTokensType & {
    from?: number;
    size?: number;
  }) => {
    const params = new URLSearchParams({
      ...(from != null && size != null
        ? { from: String(from), size: String(size) }
        : {}),
      ...(search ? { search } : {})
    }).toString();

    return axios.get<TokenType[]>(
      `/accounts/${address}/tokens?${params}`,
      props
    );
  };

export const getTokensCount =
  (props: ApiPropsType) =>
  ({ address, search }: GetTokensType) => {
    const params = new URLSearchParams({
      ...(search ? { search } : {})
    }).toString();

    return axios.get<number>(
      `/accounts/${address}/tokens/count?${params}`,
      props
    );
  };

export const getAccountToken =
  (apiProps: ApiPropsType) => (props: { address: string; token: string }) => {
    const { address, token } = props;

    return axios.get<TokenType>(
      `/accounts/${address}/tokens/${token}`,
      apiProps
    );
  };

export const getToken = (props: ApiPropsType) => (token: string) => {
  return axios.get<TokenType>(`/tokens/${token}`, props);
};

export interface FetchTokensArgumentsType {
  address: string;
  page?: number;
  search?: string;
  size?: number;
}

export const fetchTokens =
  (props: ApiPropsType) =>
  async ({ address, page = 1, search, size }: FetchTokensArgumentsType) => {
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

    const getData = getTokens(props);
    const { data: newTokens } = await getData(params);
    return newTokens;
  };

export const fetchAllTokens =
  (props: ApiPropsType) => async (address: string) => {
    const tokens = [];
    let hasMoreTokens = true;
    let page = 1;
    while (hasMoreTokens) {
      try {
        const getData = fetchTokens(props);
        const data = await getData({ address, size: maxCount, page });
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
  };
