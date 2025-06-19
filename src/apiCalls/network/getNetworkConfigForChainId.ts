import { getServerConfiguration } from '@multiversx/sdk-dapp/out/apiCalls/configuration/getServerConfiguration';
import { NetworkType } from '@multiversx/sdk-dapp/out/types/network.types';
import { getApiAddressForChainID } from 'apiCalls/network/getApiAddressForChainID';

export async function getNetworkConfigForChainId(
  chainId: string
): Promise<NetworkType | null> {
  const apiAddress = getApiAddressForChainID(chainId);

  return await getServerConfiguration(apiAddress);
}
