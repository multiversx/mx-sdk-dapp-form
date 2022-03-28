import React, { useEffect, useState } from 'react';
import { CustomNetworkType, NetworkType } from '@elrondnetwork/dapp-core';
import { getNetworkConfigForChainId, setApiConfig } from 'apiCalls';
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
  customNetworkConfig?: CustomNetworkType;
  children: React.ReactNode;
  initGasLimitError: string | null;
}
export function AppInfoContextProvider({
  account,
  formInfo,
  tokensInfo,
  customNetworkConfig,
  children,
  initGasLimitError
}: AppInfoContextProviderPropsType) {
  const { chainId } = account;

  const [networkConfig, setNetwork] = useState<NetworkType>();

  async function fetchNetworkConfiguration() {
    const newNetworkConfig = await getNetworkConfigForChainId(
      chainId,
      customNetworkConfig
    );
    setApiConfig(newNetworkConfig);
    setNetwork(newNetworkConfig);
  }

  useEffect(() => {
    fetchNetworkConfiguration();
  }, [chainId, customNetworkConfig]);

  if (!networkConfig) {
    return <SendLoader />;
  }

  return (
    <NetworkContextProvider
      value={{ networkConfig, chainId, customNetworkConfig }}
    >
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
