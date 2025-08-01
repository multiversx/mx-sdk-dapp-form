import React, {
  JSXElementConstructor,
  useEffect,
  ReactNode,
  useState
} from 'react';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/out/constants';
import { NetworkType } from '@multiversx/sdk-dapp/out/types/network.types';

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
import { ReceiverUsernameContextProvider } from './ReceiverUsernameContext';
import { SendFormContextProvider } from './SendFormProviderContext';
import {
  TokensContextInitializationPropsType,
  TokensContextProvider
} from './TokensContext';

interface AppInfoContextProviderPropsType {
  accountInfo: AccountContextPropsType;
  formInfo: FormContextBasePropsType;
  tokensInfo?: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  children: ReactNode;
  Loader?: JSXElementConstructor<any> | null;
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
}
export function AppInfoContextProvider({
  accountInfo,
  formInfo,
  tokensInfo,
  networkConfig: formNetworkConfig,
  children,
  Loader,
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
          ...formNetworkConfig,
          apiTimeout: String(
            formNetworkConfig.apiTimeout ?? newNetworkConfig.apiTimeout
          )
        };
        setApiConfig(newConfig);
        setNetworkConfig(newConfig);
        return;
      }
    }

    const localConfig: NetworkType = {
      ...fallbackConfig,
      ...formNetworkConfig,
      apiTimeout: String(
        formNetworkConfig.apiTimeout ?? fallbackConfig.apiTimeout
      )
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
              <ReceiverUsernameContextProvider>
                <GasContextProvider initGasLimitError={initGasLimitError}>
                  <DataContextProvider>
                    <AmountContextProvider>
                      <SendFormContextProvider>
                        {children}
                      </SendFormContextProvider>
                    </AmountContextProvider>
                  </DataContextProvider>
                </GasContextProvider>
              </ReceiverUsernameContextProvider>
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
