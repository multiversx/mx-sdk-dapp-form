import React, { useContext, useEffect, useState } from 'react';
import { NetworkType } from '@elrondnetwork/dapp-core';
import {
  delegationContractDataByEnvironment,
  getDelegationDataForChainId
} from 'apiCalls';
import { CustomNetworkConfigType, DelegationContractDataType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
  delegationContractData: DelegationContractDataType;
}

interface NetworkContextProviderValueType {
  chainId: string;
  networkConfig: NetworkType;
  customNetworkConfig?: CustomNetworkConfigType;
}

interface NetworkContextProviderPropsType {
  children: React.ReactNode;
  value: NetworkContextProviderValueType;
}

export const NetworkContext = React.createContext(
  {} as NetworkContextPropsType
);

export function NetworkContextProvider({
  children,
  value: { chainId, customNetworkConfig, networkConfig }
}: NetworkContextProviderPropsType) {
  const [delegationContractData, setDelegationContractData] = useState(
    delegationContractDataByEnvironment.devnet
  );

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [chainId, customNetworkConfig]);

  async function fetchNetworkConfiguration() {
    const delegationData = await getDelegationDataForChainId(chainId);
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
