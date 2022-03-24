import React, { useContext, useEffect, useState } from 'react';
import {
  fallbackNetworkConfigurations,
  NetworkType
} from '@elrondnetwork/dapp-core';
import {
  delegationContractDataByEnvironment,
  getDelegationDataForChainId
} from 'apiCalls';
import { getApiConfig, setApiConfig } from 'apiCalls/apiConfig';
import { getNetworkConfigForChainId } from 'apiCalls/network/getNetworkConfigForChainId';
import { DelegationContractDataType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
  delegationContractData: DelegationContractDataType;
}

interface NetworkContextProviderPropsType {
  children: React.ReactNode;
  value: { chainId: string };
}

export const NetworkContext = React.createContext(
  {} as NetworkContextPropsType
);

export function NetworkContextProvider({
  children,
  value: { chainId }
}: NetworkContextProviderPropsType) {
  const [networkConfig, setNetwork] = useState(
    fallbackNetworkConfigurations.devnet
  );
  const [delegationContractData, setDelegationContractData] = useState(
    delegationContractDataByEnvironment.devnet
  );

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [chainId]);

  async function fetchNetworkConfiguration() {
    getApiConfig(chainId);
    const newNetworkConfig = await getNetworkConfigForChainId(chainId);
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
