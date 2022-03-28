import { apiCalls, NetworkType } from '@elrondnetwork/dapp-core';
import { getApiAddressForChainID } from 'apiCalls/network/getApiAddressForChainID';

export async function getNetworkConfigForChainId(
  chainId: string
): Promise<NetworkType> {
  const apiAddress = getApiAddressForChainID(chainId);

  return await apiCalls.getServerConfiguration(apiAddress);
}
