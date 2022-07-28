import React, {
  useCallback,
  useContext,
  useEffect,
  ReactNode,
  ChangeEvent,
  createContext
} from 'react';
import { useFormikContext } from 'formik';

import { calculateGasLimit, getDataField } from 'operations';
import { ExtendedValuesType, TxTypeEnum, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useGasContext } from '../GasContext';
import { useTokensContext } from '../TokensContext';

export interface DataContextPropsType {
  data: string;
  dataError?: string;
  isDataInvalid: boolean;
  onChange: (
    newValue: string | ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onBlur: () => void;
  onReset: () => void;
}

interface DataContextProviderPropsType {
  children: ReactNode;
}

export const DataFieldContext = createContext({} as DataContextPropsType);

export function DataContextProvider({
  children
}: DataContextProviderPropsType) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();
  const { checkInvalid, prefilledForm, isEgldTransaction } = useFormContext();
  const { nft } = useTokensContext();
  const { receiver, txType, amount, tokenId, customBalanceRules } = values;
  const { onChangeGasLimit } = useGasContext();

  const isDataInvalid = checkInvalid(ValuesEnum.data);

  const handleUpdateData = (
    newValue: ChangeEvent<any> | string,
    shouldValidate = false
  ) => {
    const value =
      typeof newValue === 'string' ? newValue : newValue?.target?.value;
    setFieldValue(ValuesEnum.data, value, shouldValidate);
    if (!prefilledForm && !touched.gasLimit && isEgldTransaction) {
      const newGasLimit = calculateGasLimit({
        data: value
      });
      onChangeGasLimit(newGasLimit);
    }
  };

  const handleBlurData = useCallback(() => {
    setFieldTouched(ValuesEnum.data, true);
  }, [handleBlur]);

  const handleResetData = useCallback(() => {
    handleUpdateData('');
  }, []);

  useEffect(() => {
    if (!prefilledForm || customBalanceRules?.dataFieldBuilder) {
      const receiverError = txType !== TxTypeEnum.ESDT ? errors.receiver : '';

      const newDataField = getDataField({
        txType,
        values,
        nft,
        amountError: Boolean(errors.amount),
        receiverError
      });
      handleUpdateData(newDataField);
    }
  }, [
    amount,
    receiver,
    prefilledForm,
    nft,
    errors.receiver,
    errors.amount,
    txType
  ]);

  useEffect(() => {
    const resetDataFieldOnEgldSelect = !prefilledForm && isEgldTransaction;
    if (resetDataFieldOnEgldSelect) {
      handleUpdateData('');
    }
  }, [tokenId, isEgldTransaction]);

  const value = {
    data: values.data,
    dataError: errors.data,
    isDataInvalid,
    onChange: handleUpdateData,
    onBlur: handleBlurData,
    onReset: handleResetData
  };
  return (
    <DataFieldContext.Provider value={value}>
      {children}
    </DataFieldContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataFieldContext);
}
