import { apiCalls } from '@elrondnetwork/dapp-core';

const chainIDToEnvironment: Record<string, string> = {
  D: 'devnet',
  T: 'testnet',
  '1': 'mainnet'
};

export function getEnvironmentForChainId(chainId: string) {
  return chainIDToEnvironment[chainId];
}

export async function getNetworkConfigForChainId(chainId: string) {
  const environment = getEnvironmentForChainId(chainId);
  return await apiCalls.getServerConfigurationForEnvironment(environment);
}
