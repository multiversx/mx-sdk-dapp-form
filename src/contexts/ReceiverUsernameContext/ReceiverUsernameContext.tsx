import React, { useContext, ReactNode, createContext } from 'react';
import { Address } from '@multiversx/sdk-core/out';
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
  usernameIsAmongKnown: boolean;
  usernameAccounts: UsernameAccountsType;
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

  let searchQueryIsAddress = false;

  try {
    Address.newFromBech32(inputValue);
    searchQueryIsAddress = true;
  } catch (error) {
    console.error(error);
  }
  const debouncedUsername = useDebounce(inputValue, MS_100);

  const usernameExactMatchExists = knownAddresses?.some(
    (account) => account.username === inputValue
  );

  const { usernameAccounts } = useUsernameAccount({
    shouldSkipSearch: Boolean(usernameExactMatchExists),
    searchPatternToLookFor: debouncedUsername
  });

  const foundReceiver = usernameAccounts[inputValue]?.username;

  const isUsernameDebouncing =
    inputValue !== debouncedUsername && foundReceiver !== null;

  const usernameIsAmongKnown = getIsValueAmongKnown({
    key: 'username',
    knownAddresses,
    inputValue
  });

  const isUsernameFetching =
    !isUsernameDebouncing && foundReceiver === undefined && inputValue;

  const isUsernameLoading = Boolean(
    isUsernameFetching && !searchQueryIsAddress && !usernameIsAmongKnown
  );

  const showUsernameError = Boolean(
    inputValue &&
      debouncedUsername &&
      !isUsernameDebouncing &&
      !isUsernameFetching &&
      !foundReceiver &&
      !searchQueryIsAddress // &&
  );

  const value: ReceiverUsernameContextPropsType = {
    showUsernameError,
    isUsernameLoading,
    isUsernameDebouncing,
    usernameIsAmongKnown,
    receiverUsername,
    receiverUsernameError,
    isReceiverUsernameInvalid: Boolean(receiverUsernameError),
    usernameAccounts,
    searchQueryIsAddress
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
