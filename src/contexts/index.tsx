import React from 'react';
import {
  AccountContextPropsType,
  AccountContextProvider
} from './AccountContext';
import { AmountContextProvider } from './AmountContext';
import { ApiContextPropsType, ApiContextProvider } from './ApiContext';
import { DataContextProvider } from './DataFieldContext';
import { FormContextBasePropsType, FormContextProvider } from './FormContext';
import { GasContextProvider } from './GasContext';
import { ReceiverContextProvider } from './ReceiverContext';
import { SendFormContextProvider } from './SendFormProviderContext';
import {
  TokensContextInitializationPropsType,
  TokensContextProvider
} from './TokensContext';

interface AppInfoContextProviderPropsType {
  account: AccountContextPropsType;
  formInfo: FormContextBasePropsType;
  apiInfo: ApiContextPropsType;
  tokensInfo: TokensContextInitializationPropsType;
  children: React.ReactNode;
  initGasLimitError: string | null;
}
export function AppInfoContextProvider({
  account,
  formInfo,
  tokensInfo,
  apiInfo,
  children,
  initGasLimitError
}: AppInfoContextProviderPropsType) {
  return (
    <ApiContextProvider value={apiInfo}>
      <AccountContextProvider value={account}>
        <FormContextProvider value={formInfo}>
          <TokensContextProvider value={tokensInfo}>
            {/*This order is intentional, because each context consumes the data of the context above him*/}
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
    </ApiContextProvider>
  );
}

export * from './FormContext';
export * from './AccountContext';
export * from './TokensContext';
export * from './ApiContext';
export * from './SendFormProviderContext';
