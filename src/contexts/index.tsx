import React, { useEffect, useState } from 'react';
import {
  fallbackNetworkConfigurations,
  NetworkType
} from '@elrondnetwork/dapp-core';
import {
  getEnvironmentForChainId,
  getNetworkConfigForChainId,
  setApiConfig
} from 'apiCalls';
import { FormNetworkConfigType } from 'types';
import { SendLoader } from 'UI';
import {
  AccountContextPropsType,
  AccountContextProvider
} from './AccountContext';
import { AmountContextProvider } from './AmountContext';
import { DataContextProvider } from './DataFieldContext';
import { FormContextBasePropsType, FormContextProvider } from './FormContext';
import { GasContextProvider } from './GasContext';
import { NetworkContextProvider } from './NetworkContext';
import { ReceiverContextProvider } from './ReceiverContext';
import { SendFormContextProvider } from './SendFormProviderContext';
import {
  TokensContextInitializationPropsType,
  TokensContextProvider
} from './TokensContext';

interface AppInfoContextProviderPropsType {
  account: AccountContextPropsType;
  formInfo: FormContextBasePropsType;
  tokensInfo: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  children: React.ReactNode;
  initGasLimitError: string | null;
}
export function AppInfoContextProvider({
  account,
  formInfo,
  tokensInfo,
  networkConfig: formNetworkConfig,
  children,
  initGasLimitError
}: AppInfoContextProviderPropsType) {
  const [networkConfig, setNetworkConfig] = useState<NetworkType>();

  async function fetchNetworkConfiguration() {
    const fetchFromServer = !formNetworkConfig.skipFetchFromServer;
    const { chainId } = formNetworkConfig;
    const environment = getEnvironmentForChainId(chainId);
    const fallbackConfig = fallbackNetworkConfigurations[environment] || {};

    if (fetchFromServer) {
      const newNetworkConfig = await getNetworkConfigForChainId(chainId);
      if (newNetworkConfig) {
        const newConfig = {
          ...fallbackConfig,
          ...newNetworkConfig,
          ...formNetworkConfig
        };
        setApiConfig(newConfig);
        setNetworkConfig(newConfig);
        return;
      }
    }

    const localConfig: NetworkType = {
      ...fallbackConfig,
      ...formNetworkConfig
    };
    setApiConfig(localConfig);
    setNetworkConfig(localConfig);
  }

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [formNetworkConfig]);

  if (!networkConfig) {
    return <SendLoader />;
  }

  return (
    <NetworkContextProvider value={{ networkConfig }}>
      <AccountContextProvider value={account}>
        <FormContextProvider value={formInfo}>
          <TokensContextProvider value={tokensInfo}>
            {/*This order is intentional, because each context consumes the data of the context above*/}
            <DataContextProvider>
              <ReceiverContextProvider>
                <GasContextProvider initGasLimitError={initGasLimitError}>
                  <AmountContextProvider>
                    <SendFormContextProvider>
                      {children}
                    </SendFormContextProvider>
                  </AmountContextProvider>
                </GasContextProvider>
              </ReceiverContextProvider>
            </DataContextProvider>
          </TokensContextProvider>
        </FormContextProvider>
      </AccountContextProvider>
    </NetworkContextProvider>
  );
}

export * from './FormContext';
export * from './AccountContext';
export * from './TokensContext';
export * from './NetworkContext';
export * from './SendFormProviderContext';
