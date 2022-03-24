import { NetworkType } from '@elrondnetwork/dapp-core';
import { getNetworkConfigForChainId } from 'apiCalls/network';

interface ApiConfigType {
  baseURL: string;
  timeout: number;
}

let apiConfig: ApiConfigType | null = null;

export function setApiConfig(networkConfiguration: NetworkType) {
  apiConfig = {
    baseURL: networkConfiguration.apiAddress,
    timeout: Number(networkConfiguration.apiTimeout)
  };
}

export async function getApiConfig(chainId?: string) {
  if (apiConfig != null) {
    return apiConfig;
  }
  console.error(
    'Cannot get API config before initialization, make sure to call setApiConfig first'
  );
  if (chainId != null) {
    //try and get the network config if chainId is passed
    const config = await getNetworkConfigForChainId(chainId);
    apiConfig = config;
    return config;
  }
  return new Promise((resolve, reject) => {
    //keep the async call to try and pool the apiConfig when it's initialized
    const interval = setInterval(() => {
      if (apiConfig != null) {
        //resolve if apiConfig is initialized
        resolve(apiConfig);
      }
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      //after 5 seconds, time out the promise and throw
      reject('Cannot get API Config');
    }, 5000);
  });
}
