import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { MetaEsdtType, NftEnumType } from 'types';

import { getApiConfig } from '../helpers';

interface GetTokensType {
  address: string;
  search?: string;
}

const maxCount = 1000;
const tokenPayloadSize = 100;

export const getMetaEsdts = ({
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

  return axios.get<MetaEsdtType[]>(
    `/accounts/${address}/nfts?${params}&type=MetaESDT`,
    getApiConfig()
  );
};

export const getMetaEsdtsCount = ({ address, search }: GetTokensType) => {
  const params = new URLSearchParams({
    ...(search ? { search } : {})
  }).toString();

  return axios.get<number>(
    `/accounts/${address}/nfts/count?${params}&type=${NftEnumType.MetaESDT}`,
    getApiConfig()
  );
};

interface FetchTokensArgumentsType {
  address: string;
  page?: number;
  search?: string;
  size?: number;
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
