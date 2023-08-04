import React, { useContext, ReactNode, createContext } from 'react';
import { useFormikContext } from 'formik';
import { useReceiverContext } from 'contexts/ReceiverContext';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';
import { ExtendedValuesType } from 'types';
import { getIsValueAmongKnown } from './helpers';
import { useUsernameAccount } from './hooks';
import { UsernameAccountsType } from './hooks/useFetchUsernameAddress';

export interface ReceiverUsernameContextPropsType {
  receiverUsername?: string;
  receiverUsernameError?: string;
  isReceiverUsernameInvalid: boolean;
  showUsernameError: boolean;
  searchQueryIsAddress: boolean;
  isUsernameLoading: boolean;
  isUsernameDebouncing: boolean;
  isUsernameFetching: boolean;
  usernameIsAmongKnown: boolean;
  usernameAccounts: UsernameAccountsType;
  foundReceiver: UsernameAccountsType[0];
}

interface ReceiverUsernameContextProviderPropsType {
  children: ReactNode;
}

export const ReceiverUsernameContext = createContext(
  {} as ReceiverUsernameContextPropsType
);

const MS_100 = process.env.NODE_ENV !== 'test' ? 1000 : 1;

export function ReceiverUsernameContextProvider({
  children
}: ReceiverUsernameContextProviderPropsType) {
  const {
    values: { receiverUsername },
    errors: { receiverUsername: receiverUsernameError }
  } = useFormikContext<ExtendedValuesType>();
  const { receiverInputValue: inputValue, knownAddresses } =
    useReceiverContext();

  const searchQueryIsAddress = inputValue.startsWith('erd1');
  const debouncedUsername = useDebounce(inputValue, MS_100);

  const usernameExactMatchExists = knownAddresses
    ? knownAddresses.find((account) => account.username === inputValue)
    : false;

  const { usernameAccounts } = useUsernameAccount({
    shouldSkipSearch: Boolean(usernameExactMatchExists) || searchQueryIsAddress,
    searchPatternToLookFor: debouncedUsername
  });

  const foundReceiver = usernameAccounts[inputValue];
  const isUsernameDebouncing =
    inputValue !== debouncedUsername && foundReceiver !== null;

  const usernameIsAmongKnown = getIsValueAmongKnown({
    key: 'username',
    knownAddresses,
    inputValue
  });

  const isUsernameFetching =
    !isUsernameDebouncing && foundReceiver === undefined && inputValue;

  const showUsernameError = Boolean(
    inputValue &&
      debouncedUsername &&
      !isUsernameDebouncing &&
      !isUsernameFetching &&
      !foundReceiver &&
      !searchQueryIsAddress // &&
  );

  const isUsernameLoading = Boolean(
    inputValue &&
      !searchQueryIsAddress &&
      isUsernameFetching &&
      !usernameIsAmongKnown
  );

  const value: ReceiverUsernameContextPropsType = {
    showUsernameError,
    isUsernameLoading,
    isUsernameFetching: Boolean(isUsernameFetching),
    isUsernameDebouncing,
    usernameIsAmongKnown,
    receiverUsername,
    receiverUsernameError,
    isReceiverUsernameInvalid: Boolean(receiverUsernameError),
    usernameAccounts,
    searchQueryIsAddress,
    foundReceiver
  };

  return (
    <ReceiverUsernameContext.Provider value={value}>
      {children}
    </ReceiverUsernameContext.Provider>
  );
}

export function useReceiverUsernameContext() {
  return useContext(ReceiverUsernameContext);
}
