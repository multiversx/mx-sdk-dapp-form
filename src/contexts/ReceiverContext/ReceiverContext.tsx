import React, { useCallback, useContext, createContext, useState } from 'react';
import { useFormikContext } from 'formik';

import { ExtendedValuesType } from 'types';
import { useFormContext } from '../FormContext';
import { useFetchKnownAddresses, useScamError } from './hooks';

export interface KnowAddressType {
  address: string;
  username?: string;
  rawUsername?: string;
}

export interface ReceiverContextPropsType {
  receiver: string;
  receiverInputValue: string;
  setReceiverInputValue: (value: string) => void;
  receiverError?: string;
  isReceiverInvalid: boolean;
  knownAddresses: KnowAddressType[] | null;
  scamError?: string;
  fetchingScamAddress: boolean;
  onChangeReceiver: (newReceiver: string, shouldValidate?: boolean) => void;
  onBlurReceiver: (event: Event) => void;
}

interface ReceiverContextProviderPropsType {
  children: any;
}

export const ReceiverContext = createContext({} as ReceiverContextPropsType);

const receiverField = 'receiver';

export function ReceiverContextProvider({
  children
}: ReceiverContextProviderPropsType) {
  const {
    values: { receiver },
    errors: { receiver: receiverError },
    setFieldValue,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();
  const { checkInvalid } = useFormContext();
  const [receiverInputValue, setReceiverInputValue] = useState(receiver);

  const { scamError, fetchingScamAddress } = useScamError(receiver);
  const knownAddresses = useFetchKnownAddresses();

  const handleChangeReceiver = useCallback(
    (newReceiver: string, shouldValidate = false) => {
      setFieldValue(receiverField, newReceiver, shouldValidate);
    },
    []
  );

  const handleBlurReceiver = useCallback(() => {
    setFieldTouched(receiverField, true);
  }, []);

  const contextValue: ReceiverContextPropsType = {
    receiver,
    receiverError,
    receiverInputValue,
    setReceiverInputValue: (value: string) => setReceiverInputValue(value),
    isReceiverInvalid: checkInvalid(receiverField),
    scamError,
    fetchingScamAddress,
    knownAddresses,
    onChangeReceiver: handleChangeReceiver,
    onBlurReceiver: handleBlurReceiver
  };

  return (
    <ReceiverContext.Provider value={contextValue}>
      {children}
    </ReceiverContext.Provider>
  );
}

export function useReceiverContext() {
  return useContext(ReceiverContext);
}
