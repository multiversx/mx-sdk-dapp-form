import { getServerConfiguration } from '@elrondnetwork/dapp-core/apiCalls/configuration/getServerConfiguration';
import { NetworkType } from '@elrondnetwork/dapp-core/types/network';
import { getApiAddressForChainID } from 'apiCalls/network/getApiAddressForChainID';

export async function getNetworkConfigForChainId(
  chainId: string
): Promise<NetworkType> {
  const apiAddress = getApiAddressForChainID(chainId);

  return await getServerConfiguration(apiAddress);
}
