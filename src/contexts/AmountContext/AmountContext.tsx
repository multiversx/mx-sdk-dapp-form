import React, {
  useCallback,
  useContext,
  useState,
  ChangeEvent,
  ReactNode,
  createContext,
  useEffect
} from 'react';
import { DIGITS } from '@multiversx/sdk-dapp-utils/out';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsFloat';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import { ExtendedValuesType, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { useTokensContext } from '../TokensContext';
import { useGetMaxAmountAvailable } from './hooks';
import {
  getIsAmountInvalid,
  getIsMaxButtonVisible,
  getPercentageOfAmount
} from './utils';

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
    newValue: string | ChangeEvent<HTMLInputElement>,
    shouldValidate?: boolean
  ) => void;
  onMaxClicked: () => void;
  onSetAmountPercentage: (percentage: number) => void;
}

interface AmountContextProviderPropsType {
  children: ReactNode;
}

export const AmountContext = createContext({} as AmountContextPropsType);

export function AmountContextProvider({
  children
}: AmountContextProviderPropsType) {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();

  const { readonly, uiOptions } = useFormContext();
  const { maxAmountAvailable, maxAmountMinusDust } = useGetMaxAmountAvailable();

  const [amountRange, setAmountRange] = useState(
    getPercentageOfAmount(values.amount, maxAmountMinusDust)
  );

  const [isMaxClicked, setIsMaxClicked] = useState(false);
  const { nft } = useTokensContext();

  const isMaxButtonVisible = uiOptions?.showAmountSlider
    ? false
    : getIsMaxButtonVisible({
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
    (percentage: number, updateFieldValue = true) => {
      const avoidDivisionByZero = new BigNumber(maxAmountMinusDust).isZero();
      if (avoidDivisionByZero || !stringIsFloat(percentage.toString())) {
        setAmountRange(0);
        return;
      }

      const amountBN = new BigNumber(maxAmountMinusDust)
        .times(percentage)
        .dividedBy(100);

      const value = formatAmount({
        input: parseAmount(String(amountBN)),
        digits: DIGITS,
        showLastNonZeroDecimal: percentage >= 100
      });

      if (updateFieldValue) {
        setFieldValue(ValuesEnum.amount, value);
      }

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
    (
      newValue: string | ChangeEvent<HTMLInputElement>,
      shouldValidate = true
    ) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;

      setFieldTouched(ValuesEnum.amount, true);
      onSetAmountPercentage(
        getPercentageOfAmount(value, maxAmountMinusDust),
        false
      );

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

  useEffect(() => {
    if (BigNumber(maxAmountMinusDust).isGreaterThan(0)) {
      onSetAmountPercentage(
        getPercentageOfAmount(values.amount, maxAmountMinusDust),
        false
      );
    }
  }, [getPercentageOfAmount, maxAmountMinusDust]);

  // if the amount is zero, let the insufficient funds error go to gasLimit
  const isInvalid = getIsAmountInvalid({
    values,
    errors,
    touched
  });

  const value = {
    amount: values.amount,
    error: errors.amount,
    isInvalid,
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
