import React, { useCallback, useContext } from 'react';
import { useFormikContext } from 'formik';
import { ExtendedValuesType } from 'types';
import { useFormContext } from '../FormContext';
import { useFetchKnownAddresses, useScamError } from './utils';

export interface ReceiverContextPropsType {
  receiver: string;
  receiverError?: string;
  isReceiverInvalid: boolean;
  knownAddresses: string[];
  scamError?: string;
  onChangeReceiver: (newReceiver: string, shouldValidate?: boolean) => void;
  onBlurReceiver: (e: Event) => void;
}

interface ReceiverContextProviderPropsType {
  children: any;
}

export const ReceiverContext = React.createContext(
  {} as ReceiverContextPropsType
);

const receiverField = 'receiver';

export function ReceiverContextProvider({
  children
}: ReceiverContextProviderPropsType) {
  const {
    values: { receiver: receiver },
    errors: { receiver: receiverError },
    setFieldValue,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();
  const { checkInvalid } = useFormContext();

  const scamError = useScamError(receiver);
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
    isReceiverInvalid: checkInvalid(receiverField),
    scamError,
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
