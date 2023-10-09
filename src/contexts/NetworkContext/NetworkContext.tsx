import React, {
  useContext,
  ReactNode,
  useEffect,
  useState,
  createContext
} from 'react';
import { NetworkType } from '@multiversx/sdk-dapp/types/network.types';

import { getDelegationDataForChainId } from 'apiCalls';
import { DelegationContractDataType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
  delegationContractData: DelegationContractDataType | null;
}

interface NetworkContextProviderValueType {
  networkConfig: NetworkType;
}

interface NetworkContextProviderPropsType {
  children: ReactNode;
  value: NetworkContextProviderValueType;
}

export const NetworkContext = createContext({} as NetworkContextPropsType);

export function NetworkContextProvider({
  children,
  value: { networkConfig }
}: NetworkContextProviderPropsType) {
  const [delegationContractData, setDelegationContractData] =
    useState<DelegationContractDataType | null>(null);

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
