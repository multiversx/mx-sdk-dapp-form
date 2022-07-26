import React, { useCallback, useContext, useState } from 'react';
import { useFormikContext } from 'formik';
import { ExtendedValuesType, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useTokensContext } from '../TokensContext';
import { useGetMaxAmountAvailable } from './hooks';
import { getIsMaxButtonVisible } from './utils';

export interface AmountContextPropsType {
  amount: string;
  error?: string;
  isInvalid: boolean;
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
  isMaxButtonVisible: boolean;
  isMaxClicked: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (
    newValue: string | React.ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onMaxClicked: () => void;
}

interface AmountContextProviderPropsType {
  children: React.ReactNode;
}

export const AmountContext = React.createContext({} as AmountContextPropsType);

export function AmountContextProvider({
  children
}: AmountContextProviderPropsType) {
  const {
    values,
    errors,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();

  const [isMaxClicked, setIsMaxClicked] = useState(false);
  const { nft } = useTokensContext();

  const { checkInvalid, readonly } = useFormContext();
  const { maxAmountAvailable, maxAmountMinusDust } = useGetMaxAmountAvailable();

  const isMaxButtonVisible = getIsMaxButtonVisible({
    nft,
    amount: values.amount,
    readonly,
    maxAmountAvailable,
    maxAmountMinusDust,
    txType: values.txType
  });

  function onFocus() {
    setIsMaxClicked(false);
  }

  const onChange = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = true) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;
      return setFieldValue(ValuesEnum.amount, value, shouldValidate);
    },
    [setFieldValue]
  );
  const onSetError = useCallback(
    (value: string) => setFieldError(ValuesEnum.amount, value),
    [setFieldError]
  );
  const onBlur = useCallback(() => {
    setFieldTouched(ValuesEnum.amount, true);
  }, [handleBlur]);

  const onMaxClicked = useCallback(() => {
    setIsMaxClicked(true);
    return onChange(maxAmountMinusDust || values.amount);
  }, [maxAmountMinusDust]);

  const value = {
    amount: values.amount,
    error: errors.amount,
    isInvalid: checkInvalid(ValuesEnum.amount),
    maxAmountAvailable,
    maxAmountMinusDust,
    isMaxButtonVisible,
    isMaxClicked,
    onFocus,
    onBlur,
    onChange,
    onMaxClicked,
    onSetError
  };

  return (
    <AmountContext.Provider value={value}>{children}</AmountContext.Provider>
  );
}

export function useAmountContext() {
  return useContext(AmountContext);
}
