import React, { useContext } from 'react';
import { AccountContextPropsType, useAccountContext } from './AccountContext';
import { AmountContextPropsType, useAmountContext } from './AmountContext';
import { DataContextPropsType, useDataContext } from './DataFieldContext';

import { FormContextPropsType, useFormContext } from './FormContext';
import { GasContextPropsType, useGasContext } from './GasContext';
import {
  ReceiverContextPropsType,
  useReceiverContext
} from './ReceiverContext';
import { TokensContextPropsType, useTokensContext } from './TokensContext';

export interface SendFormContextPropsType {
  amountInfo: AmountContextPropsType;
  accountInfo: AccountContextPropsType;
  formInfo: FormContextPropsType;
  tokensInfo: TokensContextPropsType;
  gasInfo: GasContextPropsType;
  dataFieldInfo: DataContextPropsType;
  receiverInfo: ReceiverContextPropsType;
}

interface SendFormContextProviderPropsType {
  children: React.ReactNode;
}

export const SendFormContext = React.createContext(
  {} as SendFormContextPropsType
);

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
  return (
    <SendFormContext.Provider
      value={{
        accountInfo,
        formInfo,
        tokensInfo,
        gasInfo,
        dataFieldInfo,
        receiverInfo,
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
