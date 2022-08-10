import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  gasPerDataByte,
  gasPriceModifier
} from '@elrondnetwork/dapp-core/constants/index';
import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { isContract } from '@elrondnetwork/dapp-core/utils/smartContracts';
import { useFormikContext } from 'formik';
import { tokenGasLimit, ZERO } from 'constants/index';
import { getIsAmountInvalid } from 'contexts/AmountContext/utils';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import useFetchGasLimit from 'hooks/useFetchGasLimit';
import {
  calculateGasLimit,
  calculateNftGasLimit,
  denominatedConfigGasPrice
} from 'operations';
import { ExtendedValuesType, TxTypeEnum, ValuesEnum } from 'types';
import { useAccountContext } from '../AccountContext';
import { useFormContext } from '../FormContext';
import { getDefaultGasLimit } from './utils';

export interface GasContextPropsType {
  gasPrice: string;
  gasLimit: string;
  gasCostLimit: string;
  gasCostLoading: boolean;
  gasCostError?: string | null;
  hasErrors: boolean;
  isGasLimitInvalid: boolean;
  isGasPriceInvalid: boolean;
  gasPriceError?: string;
  gasLimitError?: string;
  defaultGasLimit: string;
  feeLimit: string;
  onChangeFeeLimit: (newValue: string) => void;
  onChangeGasPrice: (
    newValue: string | React.ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onChangeGasLimit: (
    newValue: string | React.ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onBlurGasPrice: () => void;
  onBlurGasLimit: () => void;
  onResetGasPrice: () => void;
  onResetGasLimit: () => void;
}

interface GasContextProviderPropsType {
  children: React.ReactNode;
  initGasLimitError?: string | null;
}

export const GasContext = React.createContext({} as GasContextPropsType);

export function GasContextProvider({
  children,
  initGasLimitError
}: GasContextProviderPropsType) {
  const [feeLimit, setFeeLimit] = useState(ZERO);

  const formikContext = useFormikContext<ExtendedValuesType>();

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
  } = formikContext;

  const { gasPrice, gasLimit, data, tokenId, receiver, txType } = values;

  const {
    checkInvalid,
    isNftTransaction,
    isEsdtTransaction,
    prefilledForm
  } = useFormContext();
  const { balance, address, nonce } = useAccountContext();
  const {
    networkConfig: { id: chainId }
  } = useNetworkConfigContext();

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

  const isAmountInvalid = getIsAmountInvalid({
    values,
    errors: formikContext.errors,
    touched
  });

  // gasLimit errors should only show once amonut is valid
  const isGasLimitInvalid =
    !isAmountInvalid && checkInvalid(ValuesEnum.gasLimit);

  const isGasPriceInvalid = checkInvalid(ValuesEnum.gasPrice);

  const handleUpdateGasPrice = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = false) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;
      if (isNaN(Number(value))) {
        return;
      }
      setFieldValue(ValuesEnum.gasPrice, value, shouldValidate);
    },
    []
  );

  const handleUpdateGasLimit = useCallback(
    (newValue: string | React.ChangeEvent<any>, shouldValidate = false) => {
      const value =
        typeof newValue === 'string' ? newValue : newValue?.target?.value;

      setFieldValue(ValuesEnum.gasLimit, value, shouldValidate);
    },
    []
  );

  const handleResetGasPrice = useCallback(() => {
    setFieldValue(ValuesEnum.gasPrice, denominatedConfigGasPrice);
  }, []);

  const handleResetGasLimit = useCallback(() => {
    setFieldValue(ValuesEnum.gasLimit, defaultGasLimit);
  }, [isNftTransaction]);

  const handleBlurGasPrice = useCallback(() => {
    setFieldTouched(ValuesEnum.gasPrice, true);
  }, []);

  const handleBlurGasLimit = useCallback(() => {
    setFieldTouched(ValuesEnum.gasLimit, true);
  }, []);

  const hasErrors = Boolean(gasPriceError) || Boolean(gasLimitError);
  useEffect(() => {
    const newFeeLimit = !hasErrors
      ? calculateFeeLimit({
          gasLimit,
          gasPrice: nominate(gasPrice),
          data: data.trim(),
          chainId,
          gasPerDataByte: String(gasPerDataByte),
          gasPriceModifier: String(gasPriceModifier)
        })
      : ZERO;
    setFeeLimit(newFeeLimit);
  }, [gasLimit, data, chainId, gasPrice, hasErrors]);

  useEffect(() => {
    if (!prefilledForm && isNftTransaction && !touched.gasLimit) {
      handleUpdateGasLimit(calculateNftGasLimit());
    }
  }, [isNftTransaction, touched]);

  useEffect(() => {
    if (!prefilledForm) {
      switch (txType) {
        case TxTypeEnum.ESDT:
          handleUpdateGasLimit(tokenGasLimit);
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
  }, [tokenId, txType]);

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
