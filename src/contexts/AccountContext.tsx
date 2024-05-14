import React, { useContext, ReactNode, createContext } from 'react';
import { AssetType } from '@multiversx/sdk-dapp/types/account.types';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface AccountContextPropsType {
  address: string;
  assets?: AssetType;
  nonce: number;
  balance: string;
  username?: string;
  isGuarded?: boolean;
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
