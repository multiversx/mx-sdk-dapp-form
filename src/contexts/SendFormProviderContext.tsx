import React, { useContext, createContext, ReactNode } from 'react';

import { AccountContextPropsType, useAccountContext } from './AccountContext';
import { AmountContextPropsType, useAmountContext } from './AmountContext';
import { DataContextPropsType, useDataContext } from './DataFieldContext';
import { FormContextPropsType, useFormContext } from './FormContext';
import { GasContextPropsType, useGasContext } from './GasContext';
import {
  ReceiverContextPropsType,
  useReceiverContext
} from './ReceiverContext';
import {
  ReceiverUsernameContextPropsType,
  useReceiverUsernameContext
} from './ReceiverUsernameContext';
import { TokensContextPropsType, useTokensContext } from './TokensContext';

export interface SendFormContextPropsType {
  amountInfo: AmountContextPropsType;
  accountInfo: AccountContextPropsType;
  formInfo: FormContextPropsType;
  tokensInfo: TokensContextPropsType;
  gasInfo: GasContextPropsType;
  dataFieldInfo: DataContextPropsType;
  receiverInfo: ReceiverContextPropsType;
  receiverUsernameInfo: ReceiverUsernameContextPropsType;
}

interface SendFormContextProviderPropsType {
  children: ReactNode;
}

export const SendFormContext = createContext({} as SendFormContextPropsType);

export function SendFormContextProvider({
  children
}: SendFormContextProviderPropsType) {
  const accountInfo = useAccountContext();
  const formInfo = useFormContext();
  const tokensInfo = useTokensContext();
  const amountInfo = useAmountContext();
  const gasInfo = useGasContext();
  const dataFieldInfo = useDataContext();
  const receiverInfo = useReceiverContext();
  const receiverUsernameInfo = useReceiverUsernameContext();

  return (
    <SendFormContext.Provider
      value={{
        accountInfo,
        formInfo,
        tokensInfo,
        gasInfo,
        dataFieldInfo,
        receiverInfo,
        receiverUsernameInfo,
        amountInfo
      }}
    >
      {children}
    </SendFormContext.Provider>
  );
}

export function useSendFormContext() {
  return useContext(SendFormContext);
}
