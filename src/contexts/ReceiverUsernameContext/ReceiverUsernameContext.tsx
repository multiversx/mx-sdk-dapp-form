import React, { useContext, ReactNode, createContext } from 'react';
import { useFormikContext } from 'formik';
import { ExtendedValuesType } from 'types';

export interface ReceiverUsernameContextPropsType {
  receiverUsername?: string;
  receiverUsernameError?: string;
}

interface ReceiverUsernameContextProviderPropsType {
  children: ReactNode;
}

export const ReceiverUsernameContext = createContext(
  {} as ReceiverUsernameContextPropsType
);

export function ReceiverUsernameContextProvider({
  children
}: ReceiverUsernameContextProviderPropsType) {
  const {
    values: { receiverUsername },
    errors: { receiverUsername: receiverUsernameError }
  } = useFormikContext<ExtendedValuesType>();

  return (
    <ReceiverUsernameContext.Provider
      value={{
        receiverUsername,
        receiverUsernameError
      }}
    >
      {children}
    </ReceiverUsernameContext.Provider>
  );
}

export function useReceiverUsernameContext() {
  return useContext(ReceiverUsernameContext);
}
