import { NetworkType } from '@multiversx/sdk-dapp/out/types/network.types';
import { getNetworkConfigForChainId } from 'apiCalls/network';

export interface ApiConfigType {
  baseURL: string;
  timeout: number;
}

const apiConfig: { value: ApiConfigType | null } = {
  value: null
};

export function setApiConfig(networkConfiguration: NetworkType) {
  apiConfig.value = {
    baseURL: networkConfiguration.apiAddress,
    timeout: Number(networkConfiguration.apiTimeout)
  };

  return apiConfig.value;
}

export async function getApiConfig(chainId?: string): Promise<ApiConfigType> {
  if (apiConfig.value != null) {
    return apiConfig.value;
  }
  console.error(
    'Cannot get API config before initialization, make sure to call setApiConfig first'
  );
  if (chainId != null) {
    //try and get the network config if chainId is passed
    const config = await getNetworkConfigForChainId(chainId);
    return setApiConfig(config);
  }
  const message =
    'Cannot get api config, make sure to initialize the context before calling APIs';
  console.error(message);
  throw message;
}
