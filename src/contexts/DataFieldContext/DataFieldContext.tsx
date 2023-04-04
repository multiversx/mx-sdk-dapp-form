import React, { useCallback, useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';

import { useAccountContext } from 'contexts/AccountContext';
import { calculateGasLimit, getDataField } from 'operations';
import { ExtendedValuesType, TransactionTypeEnum, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useGasContext } from '../GasContext';
import { useTokensContext } from '../TokensContext';

export interface DataContextPropsType {
  data: string;
  dataError?: string;
  isDataInvalid: boolean;
  onChange: (
    newValue: string | React.ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onBlur: () => void;
  onReset: () => void;
}

interface DataContextProviderPropsType {
  children: React.ReactNode;
}

export const DataFieldContext = React.createContext({} as DataContextPropsType);

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
  const { receiver, txType, amount, tokenId } = values;
  const { onChangeGasLimit } = useGasContext();
  const { isGuarded } = useAccountContext();

  const isDataInvalid = checkInvalid(ValuesEnum.data);

  const handleUpdateData = (
    newValue: React.ChangeEvent<any> | string,
    shouldValidate = false
  ) => {
    const value =
      typeof newValue === 'string' ? newValue : newValue?.target?.value;
    setFieldValue(ValuesEnum.data, value, shouldValidate);
    if (!prefilledForm && !touched.gasLimit && isEgldTransaction) {
      const newGasLimit = calculateGasLimit({
        data: value,
        isGuarded
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
    if (!prefilledForm) {
      const receiverError =
        txType !== TransactionTypeEnum.ESDT ? errors.receiver : '';

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
