import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core/constants/index';
import { NetworkType } from '@elrondnetwork/dapp-core/types/network.types';

import {
  getEnvironmentForChainId,
  getNetworkConfigForChainId,
  setApiConfig
} from 'apiCalls';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { FormNetworkConfigType } from 'types';
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
import {
  UICustomizationContextPropsType,
  UICustomizationContextProvider
} from './UICustomization';

interface AppInfoContextProviderPropsType {
  accountInfo: AccountContextPropsType;
  formInfo: FormContextBasePropsType;
  tokensInfo?: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  children: React.ReactNode;
  Loader?: JSXElementConstructor<any> | null;
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
  UICustomization?: UICustomizationContextPropsType;
}
export function AppInfoContextProvider({
  accountInfo,
  formInfo,
  tokensInfo,
  networkConfig: formNetworkConfig,
  children,
  Loader,
  initGasLimitError,
  UICustomization
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
    return Loader != null ? <Loader /> : null;
  }

  return (
    <NetworkContextProvider value={{ networkConfig }}>
      <AccountContextProvider value={accountInfo}>
        <FormContextProvider value={formInfo}>
          <TokensContextProvider value={tokensInfo}>
            {/*This order is intentional, because each context consumes the data of the context above*/}
            <ReceiverContextProvider>
              <GasContextProvider initGasLimitError={initGasLimitError}>
                <DataContextProvider>
                  <AmountContextProvider>
                    <SendFormContextProvider>
                      <UICustomizationContextProvider value={UICustomization}>
                        {children}
                      </UICustomizationContextProvider>
                    </SendFormContextProvider>
                  </AmountContextProvider>
                </DataContextProvider>
              </GasContextProvider>
            </ReceiverContextProvider>
          </TokensContextProvider>
        </FormContextProvider>
      </AccountContextProvider>
    </NetworkContextProvider>
  );
}

export * from './FormContext';
export * from './AccountContext';
export * from './TokensContext';
export * from './ReceiverContext';
export * from './NetworkContext';
export * from './SendFormProviderContext';
