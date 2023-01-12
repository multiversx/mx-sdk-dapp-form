import React, { useContext, useEffect, useState } from 'react';
import { NetworkType } from '@multiversx/sdk-dapp/types/network.types';
import {
  delegationContractDataByEnvironment,
  getDelegationDataForChainId
} from 'apiCalls';
import { DelegationContractDataType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
  delegationContractData: DelegationContractDataType;
}

interface NetworkContextProviderValueType {
  networkConfig: NetworkType;
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
  value: { networkConfig }
}: NetworkContextProviderPropsType) {
  const [delegationContractData, setDelegationContractData] = useState(
    delegationContractDataByEnvironment.devnet
  );

  useEffect(() => {
    fetchDelegationData();
  }, [networkConfig]);

  function fetchDelegationData() {
    const delegationData = getDelegationDataForChainId(networkConfig.id);
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
