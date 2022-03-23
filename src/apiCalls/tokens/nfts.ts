import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { NftType } from 'types';

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
    const { data }: { data: NftType } = await axios.get(
      `/accounts/${address}/nfts/${identifier}`,
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
    const { data }: { data: NftType } = await axios.get(
      `/nfts/${identifier}`,
      config
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}
