import React, { useContext, ReactNode, createContext } from 'react';
import { UseSignMultipleTransactionsPropsType } from '@multiversx/sdk-dapp/hooks/transactions/useSignMultipleTransactions';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface AccountContextPropsType {
  address: string;
  nonce: number;
  balance: string;
  isGuarded?: boolean;
  guardianProvider?: UseSignMultipleTransactionsPropsType['guardianProvider'];
  providerType: LoginMethodsEnum;
}

interface AccountContextProviderPropsType {
  children: ReactNode;
  value: AccountContextPropsType;
}

export const AccountContext = createContext({} as AccountContextPropsType);

export function AccountContextProvider({
  children,
  value
}: AccountContextProviderPropsType) {
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}
