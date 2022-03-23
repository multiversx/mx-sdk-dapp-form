import React, { useCallback, useContext, useEffect, useState } from 'react';
import { isContract, nominate } from '@elrondnetwork/dapp-core';
import { useFormikContext } from 'formik';
import { useFetchGasLimit } from 'hooks';
import {
  calculateFeeLimit,
  calculateGasLimit,
  calculateNftGasLimit,
  denominatedConfigGasPrice
} from 'operations';
import { ExtendedValuesType, TxTypeEnum } from 'types';
import { useAccountContext } from '../AccountContext';
import { useFormContext } from '../FormContext';
import { getDefaultGasLimit } from './utils';

export interface GasContextPropsType {
  gasPrice: string;
  gasLimit: string;
  gasCostLimit: string;
  gasCostLoading: boolean;
  gasCostError: string | null;
  hasErrors: boolean;
  isGasLimitInvalid: boolean;
  isGasPriceInvalid: boolean;
  gasPriceError?: string;
  gasLimitError?: string;
  defaultGasLimit: string;
  feeLimit: string;
  onChangeFeeLimit: (newValue: string) => void;
  onChangeGasPrice: (newValue: string | React.ChangeEvent<any>) => void;
  onChangeGasLimit: (newValue: string | React.ChangeEvent<any>) => void;
  onBlurGasPrice: () => void;
  onBlurGasLimit: () => void;
  onResetGasPrice: () => void;
  onResetGasLimit: () => void;
}

interface GasContextProviderPropsType {
  children: React.ReactNode;
  initGasLimitError: string | null;
}

export const GasContext = React.createContext({} as GasContextPropsType);

const gasLimitField = 'gasLimit';
const gasPriceField = 'gasPrice';

export function GasContextProvider({
  children,
  initGasLimitError
}: GasContextProviderPropsType) {
  const [feeLimit, setFeeLimit] = useState('0');

  const {
    values,
    touched,
    errors: {
      gasPrice: gasPriceError,
      gasLimit: gasLimitError,
      amount: amountError
    },
    setFieldValue,
    setFieldTouched
  } = useFormikContext<ExtendedValuesType>();
  const { gasPrice, gasLimit, data, tokenId, receiver, txType } = values;

  const {
    checkInvalid,
    isNftTransaction,
    isEsdtTransaction,
    isEgldTransaction,
    prefilledForm
  } = useFormContext();
  const { chainId, balance, address, nonce } = useAccountContext();

  const { gasCostLoading, gasCostError, gasCostLimit } = useFetchGasLimit({
    balance,
    address,
    nonce,
    values,
    chainId,
    receiver,
    gasLimitTouched: Boolean(touched.gasLimit),
    amountError: Boolean(amountError),
    gasLimitError: Boolean(gasLimitError),
    prefilledForm,
    receiverIsContract: isContract(receiver),
    gasLimitCostError: initGasLimitError
  });

  const defaultGasLimit = getDefaultGasLimit({
    isNftTransaction,
    isEsdtTransaction,
    data
  });
  const isGasLimitInvalid = checkInvalid(gasLimitField);
  const isGasPriceInvalid = checkInvalid(gasPriceField);

  const handleUpdateGasPrice = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = false) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;
      setFieldValue(gasPriceField, value, shouldValidate);
    },
    []
  );

  const handleUpdateGasLimit = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = false) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;
      setFieldValue(gasLimitField, value, shouldValidate);
    },
    []
  );

  const handleResetGasPrice = useCallback(() => {
    setFieldValue(gasPriceField, denominatedConfigGasPrice);
  }, []);

  const handleResetGasLimit = useCallback(() => {
    setFieldValue(gasLimitField, defaultGasLimit);
  }, [isNftTransaction]);

  const handleBlurGasPrice = useCallback(() => {
    setFieldTouched(gasPriceField, true);
  }, []);

  const handleBlurGasLimit = useCallback(() => {
    setFieldTouched(gasLimitField, true);
  }, []);

  const hasErrors = Boolean(gasPriceError) || Boolean(gasLimitError);

  useEffect(() => {
    const newFeeLimit = !hasErrors
      ? calculateFeeLimit({
          gasLimit,
          gasPrice: nominate(gasPrice),
          data: data.trim(),
          chainId
        })
      : '0';
    setFeeLimit(newFeeLimit);
  }, [gasLimit, hasErrors]);

  useEffect(() => {
    if (!prefilledForm && isNftTransaction && !touched.gasLimit) {
      handleUpdateGasLimit(calculateNftGasLimit());
    }
  }, [isNftTransaction, touched]);

  useEffect(() => {
    if (!prefilledForm && !touched.gasLimit && isEgldTransaction) {
      const newGasLimit = calculateGasLimit({
        data
      });
      handleUpdateGasLimit(newGasLimit);
    }
  }, [data, isEgldTransaction]);

  useEffect(() => {
    if (!prefilledForm) {
      switch (txType) {
        case TxTypeEnum.ESDT:
          handleUpdateGasLimit(gasLimit);
          break;
        case TxTypeEnum.EGLD:
          handleUpdateGasLimit(
            calculateGasLimit({
              data: data.trim()
            }),
            true
          );
          break;
        default:
          handleUpdateGasLimit(calculateNftGasLimit(), true);
          break;
      }
    }
  }, [tokenId, data, txType]);

  const value: GasContextPropsType = {
    gasPrice,
    gasLimit,
    gasCostLoading,
    feeLimit,
    defaultGasLimit,
    gasPriceError,
    gasLimitError,
    gasCostError,
    gasCostLimit,
    hasErrors,
    isGasLimitInvalid,
    isGasPriceInvalid,
    onChangeFeeLimit: setFeeLimit,
    onChangeGasLimit: handleUpdateGasLimit,
    onChangeGasPrice: handleUpdateGasPrice,
    onBlurGasPrice: handleBlurGasPrice,
    onBlurGasLimit: handleBlurGasLimit,
    onResetGasPrice: handleResetGasPrice,
    onResetGasLimit: handleResetGasLimit
  };
  return <GasContext.Provider value={value}>{children}</GasContext.Provider>;
}

export function useGasContext() {
  return useContext(GasContext);
}
