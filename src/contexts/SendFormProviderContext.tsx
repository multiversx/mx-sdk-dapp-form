import React, { useContext } from 'react';
import { AccountContextPropsType, useAccountContext } from './AccountContext';
import {
  AmountContextPropsType,
  useAmountContext
} from './AmountContext/AmountContext';
import { DataContextPropsType, useDataContext } from './DataFieldContext';

import { FormContextPropsType, useFormContext } from './FormContext';
import { GasContextPropsType, useGasContext } from './GasContext';
import {
  ReceiverContextPropsType,
  useReceiverContext
} from './ReceiverContext';
import { TokensContextPropsType, useTokensContext } from './TokensContext';

export interface SendFormContextPropsType {
  amount: AmountContextPropsType;
  account: AccountContextPropsType;
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
  const account = useAccountContext();
  const formInfo = useFormContext();
  const tokensInfo = useTokensContext();
  const amount = useAmountContext();
  const gasInfo = useGasContext();
  const dataFieldInfo = useDataContext();
  const receiverInfo = useReceiverContext();

  return (
    <SendFormContext.Provider
      value={{
        account,
        formInfo,
        tokensInfo,
        gasInfo,
        dataFieldInfo,
        receiverInfo,
        amount
      }}
    >
      {children}
    </SendFormContext.Provider>
  );
}

export function useSendFormContext() {
  return useContext(SendFormContext);
}
