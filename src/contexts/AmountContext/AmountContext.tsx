import React, { useCallback, useContext, useState } from 'react';
import { decimals } from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import { ExtendedValuesType, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useTokensContext } from '../TokensContext';
import { useGetMaxAmountAvailable } from './hooks';
import { getIsMaxButtonVisible, getPercentageOfAmount } from './utils';

export interface AmountContextPropsType {
  amount: string;
  error?: string;
  isInvalid: boolean;
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
  isMaxButtonVisible: boolean;
  amountRange: number;
  isMaxClicked: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (
    newValue: string | React.ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onMaxClicked: () => void;
  onSetAmountPercentage: (percentage: number) => void;
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

  const { checkInvalid, readonly } = useFormContext();
  const { maxAmountAvailable, maxAmountMinusDust } = useGetMaxAmountAvailable();

  const [amountRange, setAmountRange] = useState(
    getPercentageOfAmount(values.amount, maxAmountMinusDust)
  );

  const [isMaxClicked, setIsMaxClicked] = useState(false);
  const { nft } = useTokensContext();

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

  const onSetAmountPercentage = useCallback(
    (percentage: number) => {
      const total = maxAmountMinusDust;
      const amountBN = new BigNumber(total).times(percentage).dividedBy(100);
      const value = denominate({ input: nominate(String(amountBN)), decimals });

      setFieldValue(ValuesEnum.amount, value);

      if (percentage < 0) {
        setAmountRange(0);
        return;
      }

      if (percentage > 100) {
        setAmountRange(100);
        return;
      }

      setAmountRange(percentage);
    },
    [maxAmountMinusDust, setFieldValue]
  );

  const onChange = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = true) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;

      onSetAmountPercentage(getPercentageOfAmount(value, maxAmountMinusDust));

      return setFieldValue(ValuesEnum.amount, value, shouldValidate);
    },
    [setFieldValue, onSetAmountPercentage, maxAmountMinusDust]
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
    amountRange,
    onFocus,
    onBlur,
    onChange,
    onMaxClicked,
    onSetError,
    onSetAmountPercentage
  };

  return (
    <AmountContext.Provider value={value}>{children}</AmountContext.Provider>
  );
}

export function useAmountContext() {
  return useContext(AmountContext);
}
