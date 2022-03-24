import React, { useContext, useEffect, useState } from 'react';
import {
  fallbackNetworkConfigurations,
  NetworkType
} from '@elrondnetwork/dapp-core';
import { getApiConfig, setApiConfig } from 'apiCalls/apiConfig';
import { getNetworkConfigForChainId } from 'apiCalls/network/getNetworkConfigForChainId';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
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

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [chainId]);

  async function fetchNetworkConfiguration() {
    getApiConfig(chainId);
    const newNetworkConfig = await getNetworkConfigForChainId(chainId);
    setNetwork(newNetworkConfig);
    setApiConfig(newNetworkConfig);
  }

  return (
    <NetworkContext.Provider value={{ networkConfig }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkConfigContext() {
  return useContext(NetworkContext);
}
