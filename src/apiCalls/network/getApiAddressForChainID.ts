import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core';
import { getEnvironmentForChainId } from 'apiCalls/network/getEnvironmentForChainId';

export function getApiAddressForChainID(chainId: string) {
  const environment = getEnvironmentForChainId(chainId);
  const apiAddress = fallbackNetworkConfigurations[environment].apiAddress;
  if (!apiAddress) {
    throw 'Could not extract api address for environment, please check if you have a valid chainID';
  }
  return apiAddress;
}
