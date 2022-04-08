import React, { useCallback, useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { getEsdtNftDataField } from 'operations';
import { ExtendedValuesType, TxTypeEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useTokensContext } from '../TokensContext';

export interface DataContextPropsType {
  data: string;
  dataError?: string;
  isDataInvalid: boolean;
  onChange: (newValue: string | React.ChangeEvent<any>) => void;
  onBlur: () => void;
  onReset: () => void;
}

interface DataContextProviderPropsType {
  children: React.ReactNode;
}

export const DataFieldContext = React.createContext({} as DataContextPropsType);

const dataField = 'data';

export function DataContextProvider({
  children
}: DataContextProviderPropsType) {
  const { values, errors, setFieldValue, handleBlur, setFieldTouched } =
    useFormikContext<ExtendedValuesType>();
  const { checkInvalid, prefilledForm, isEgldTransaction } = useFormContext();
  const { nft } = useTokensContext();
  const { receiver, txType, amount, tokenId } = values;

  const isDataInvalid = checkInvalid(dataField);

  const handleUpdateData = (newValue: React.ChangeEvent<any> | string) => {
    const value =
      typeof newValue === 'string' ? newValue : newValue?.target?.value;
    setFieldValue(dataField, value, false);
  };

  const handleBlurData = useCallback(() => {
    setFieldTouched(dataField, true);
  }, [handleBlur]);

  const handleResetData = useCallback(() => {
    handleUpdateData('');
  }, []);

  useEffect(() => {
    if (!prefilledForm) {
      const receiverError = txType !== TxTypeEnum.ESDT ? errors.receiver : '';
      const newDataField = getEsdtNftDataField({
        txType,
        values,
        nft,
        amountError: Boolean(errors.amount),
        receiverError
      });
      handleUpdateData(newDataField);
    }
  }, [amount, receiver, prefilledForm, nft, errors.receiver, txType]);

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
