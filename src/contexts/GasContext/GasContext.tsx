import React, { useCallback, useContext, useEffect } from 'react';

import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@elrondnetwork/dapp-core/constants/index';
import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import { useFormikContext } from 'formik';
import { ZERO } from 'constants/index';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { getIsAmountInvalid } from 'contexts/AmountContext/utils';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import { parseAmount } from 'helpers';
import useFetchGasLimit from 'hooks/useFetchGasLimit';
import { calculateNftGasLimit, formattedConfigGasPrice } from 'operations';
import { getGasLimit } from 'operations/getGasLimit';
import { ExtendedValuesType, ValuesEnum } from 'types';
import { useFormContext } from '../FormContext';
import { getDefaultGasLimit } from './utils';

export interface GasContextPropsType {
  gasPrice: string;
  gasLimit: string;
  gasCostLoading: boolean;
  gasCostError?: string | null;
  hasErrors: boolean;
  isGasLimitInvalid: boolean;
  isGasPriceInvalid: boolean;
  gasPriceError?: string;
  gasLimitError?: string;
  defaultGasLimit: string;
  feeLimit: string;
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
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
}

export const GasContext = React.createContext({} as GasContextPropsType);

/**
 * **initGasLimitError**: Value coming from an intial compute of gasLimit in case the form is configured for a smart contract transaction
 */
/**
 * **initGasLimitError**: Value coming from an intial compute of gasLimit in case the form is configured for a smart contract transaction
 */
export function GasContextProvider({
  children,
  initGasLimitError
}: GasContextProviderPropsType) {
  const formikContext = useFormikContext<ExtendedValuesType>();

  const {
    values,
    touched,
    errors: { gasPrice: gasPriceError, gasLimit: gasLimitError },
    setFieldValue,
    setFieldTouched
  } = formikContext;

  const { gasPrice, gasLimit, data, tokenId, txType } = values;

  const {
    checkInvalid,
    isNftTransaction,
    isEsdtTransaction,
    prefilledForm
  } = useFormContext();
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const { gasCostLoading, gasCostError } = useFetchGasLimit(initGasLimitError);

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
    setFieldValue(ValuesEnum.gasPrice, formattedConfigGasPrice);
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
  const feeLimit = !hasErrors
    ? calculateFeeLimit({
        gasLimit,
        gasPrice: parseAmount(gasPrice),
        data: data.trim(),
        chainId,
        gasPerDataByte: String(GAS_PER_DATA_BYTE),
        gasPriceModifier: String(GAS_PRICE_MODIFIER)
      })
    : ZERO;

  useEffect(() => {
    if (!prefilledForm && isNftTransaction && !touched.gasLimit) {
      handleUpdateGasLimit(calculateNftGasLimit());
    }
  }, [isNftTransaction, touched]);

  useEffect(() => {
    if (!prefilledForm) {
      handleUpdateGasLimit(getGasLimit({ txType, data }), true);
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
    hasErrors,
    isGasLimitInvalid,
    isGasPriceInvalid,
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
