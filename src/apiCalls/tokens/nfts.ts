import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';
import { NftType } from 'types';

export interface GetNftByAddressAndIdentifierArgsType {
  address: string;
  identifier: string;
}

export async function getNftByAddressAndIdentifier({
  address,
  identifier
}: GetNftByAddressAndIdentifierArgsType) {
  try {
    const apiConfig = await getApiConfig();
    const { data }: { data: NftType } = await axios.get(
      `/accounts/${address}/nfts/${identifier}`,
      apiConfig
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}

export async function getGlobalNftByIdentifier(identifier: string) {
  try {
    const apiConfig = await getApiConfig();
    const { data }: { data: NftType } = await axios.get(
      `/nfts/${identifier}`,
      apiConfig
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}
