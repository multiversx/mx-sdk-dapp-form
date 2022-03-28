import React, { useContext, useEffect, useState } from 'react';
import {
  fallbackNetworkConfigurations,
  NetworkType
} from '@elrondnetwork/dapp-core';
import {
  delegationContractDataByEnvironment,
  getDelegationDataForChainId
} from 'apiCalls';
import { setApiConfig } from 'apiCalls/apiConfig';
import { getNetworkConfigForChainId } from 'apiCalls/network/getNetworkConfigForChainId';
import { CustomNetworkConfigType, DelegationContractDataType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
  delegationContractData: DelegationContractDataType;
}

interface NetworkContextProviderPropsType {
  children: React.ReactNode;
  value: { chainId: string; customNetworkConfig?: CustomNetworkConfigType };
}

export const NetworkContext = React.createContext(
  {} as NetworkContextPropsType
);

export function NetworkContextProvider({
  children,
  value: { chainId, customNetworkConfig }
}: NetworkContextProviderPropsType) {
  const [networkConfig, setNetwork] = useState<NetworkType>(
    fallbackNetworkConfigurations.devnet
  );
  const [delegationContractData, setDelegationContractData] = useState(
    delegationContractDataByEnvironment.devnet
  );

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [chainId, customNetworkConfig]);

  async function fetchNetworkConfiguration() {
    const newNetworkConfig = await getNetworkConfigForChainId(
      chainId,
      customNetworkConfig
    );
    const delegationData = await getDelegationDataForChainId(chainId);
    setNetwork(newNetworkConfig);
    setApiConfig(newNetworkConfig);
    setDelegationContractData(delegationData);
  }

  return (
    <NetworkContext.Provider value={{ networkConfig, delegationContractData }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkConfigContext() {
  return useContext(NetworkContext);
}
