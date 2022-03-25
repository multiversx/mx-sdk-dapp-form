import { apiCalls } from '@elrondnetwork/dapp-core';
import { getEnvironmentForChainId } from './getEnvironmentForChainId';

export async function getNetworkConfigForChainId(chainId: string) {
  const environment = getEnvironmentForChainId(chainId);
  return await apiCalls.getServerConfigurationForEnvironment(environment);
}
