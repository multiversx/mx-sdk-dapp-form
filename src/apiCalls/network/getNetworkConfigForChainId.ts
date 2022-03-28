import { apiCalls } from '@elrondnetwork/dapp-core';
import { getApiAddressForChainID } from 'apiCalls/network/getApiAddressForChainID';
import { CustomNetworkConfigType } from 'types';

export async function getNetworkConfigForChainId(
  chainId: string,
  customNetworkConfig?: CustomNetworkConfigType
) {
  const apiAddress =
    customNetworkConfig?.apiAddress || getApiAddressForChainID(chainId);

  return await apiCalls.getServerConfiguration(apiAddress);
}
