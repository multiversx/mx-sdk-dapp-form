import React from 'react';
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
  children: React.ReactNode;
  initGasLimitError: string | null;
}
export function AppInfoContextProvider({
  account,
  formInfo,
  tokensInfo,
  children,
  initGasLimitError
}: AppInfoContextProviderPropsType) {
  const { chainId } = account;
  return (
    <NetworkContextProvider value={{ chainId }}>
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
