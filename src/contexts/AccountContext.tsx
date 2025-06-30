import React, { useContext, ReactNode, createContext } from 'react';
import { ProviderTypeEnum } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';
import { AssetType } from '@multiversx/sdk-dapp/out/types/account.types';

export interface AccountContextPropsType {
  address: string;
  assets?: AssetType;
  nonce: number;
  shard: number;
  balance: string;
  username?: string;
  isGuarded?: boolean;
  providerType: typeof ProviderTypeEnum;
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
