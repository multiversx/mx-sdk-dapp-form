import axios from 'axios';
import { getApiConfig } from 'apiCalls/helpers';
import { NftType } from 'types';

interface GetNftByAddressAndIdentifierArgsType {
  address: string;
  identifier: string;
}

export async function getNftByAddressAndIdentifier({
  address,
  identifier
}: GetNftByAddressAndIdentifierArgsType) {
  try {
    const { data }: { data: NftType } = await axios.get(
      `/accounts/${address}/nfts/${identifier}`,
      getApiConfig()
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}

export async function getGlobalNftByIdentifier(identifier: string) {
  try {
    const { data }: { data: NftType } = await axios.get(
      `/nfts/${identifier}`,
      getApiConfig()
    );
    return data ? data : null;
  } catch (err) {
    return null;
  }
}
