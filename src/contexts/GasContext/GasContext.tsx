import React, {
  useCallback,
  createContext,
  ChangeEvent,
  useContext,
  ReactNode,
  useEffect,
  useMemo
} from 'react';

import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@multiversx/sdk-dapp/constants/index';
import { calculateFeeLimit } from '@multiversx/sdk-dapp/utils/operations/calculateFeeLimit';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { ZERO } from 'constants/index';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { getIsAmountInvalid } from 'contexts/AmountContext/utils';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import { getGasLimitChanged, parseAmount } from 'helpers';
import useFetchGasLimit from 'hooks/useFetchGasLimit';
import {
  calculateNftGasLimit,
  formattedConfigGasPrice,
  getGasLimit,
  getGuardedAccountGasLimit
} from 'operations';
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
    newValue: string | ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onChangeGasLimit: (
    newValue: string | ChangeEvent<any>,
    shouldValidate?: boolean
  ) => void;
  onBlurGasPrice: () => void;
  onBlurGasLimit: () => void;
  onResetGasPrice: () => void;
  onResetGasLimit: () => void;
}

interface GasContextProviderPropsType {
  children: ReactNode;
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
}

export const GasContext = createContext({} as GasContextPropsType);

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
    setFieldTouched,
    initialValues
  } = formikContext;

  const {
    gasPrice,
    gasLimit,
    data,
    tokenId,
    txType,
    isGuarded,
    receiver,
    amount
  } = values;

  const guardedAccountGasLimit = getGuardedAccountGasLimit(isGuarded);

  const {
    checkInvalid,
    isNftTransaction,
    isEsdtTransaction,
    prefilledForm,
    isEgldTransaction
  } = useFormContext();
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const { gasCostLoading, gasCostError } = useFetchGasLimit(initGasLimitError);

  const defaultGasLimit = getDefaultGasLimit({
    isNftTransaction,
    isEsdtTransaction,
    data,
    isGuarded
  });

  const isAmountInvalid = getIsAmountInvalid({
    values,
    errors: formikContext.errors,
    touched
  });

  // gasLimit errors should only show once amount is valid
  const isGasLimitInvalid =
    !isAmountInvalid && checkInvalid(ValuesEnum.gasLimit);

  const isGasPriceInvalid = checkInvalid(ValuesEnum.gasPrice);

  const handleUpdateGasPrice = useCallback(
    (newValue: string | ChangeEvent<any>, shouldValidate = false) => {
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
    (newValue: string | ChangeEvent<any>, shouldValidate = false) => {
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

  const feeLimit = useMemo(() => {
    const isInvalidGasLimit = !stringIsInteger(gasLimit);
    const isInvalidGasPrice = !stringIsFloat(gasPrice);

    if (isInvalidGasLimit || isInvalidGasPrice) {
      return ZERO;
    }

    const isGasLimitChanged = getGasLimitChanged({
      initialValues,
      gasLimit,
      touched
    });

    const isInitialGasLimit =
      !prefilledForm && !isGasLimitChanged && isEgldTransaction;

    const dataField = isInitialGasLimit ? data.trim() : '';

    const newFeeLimit = calculateFeeLimit({
      gasLimit,
      gasPrice: parseAmount(gasPrice),
      data: dataField,
      chainId,
      gasPerDataByte: String(GAS_PER_DATA_BYTE),
      gasPriceModifier: String(GAS_PRICE_MODIFIER)
    });

    return stringIsInteger(newFeeLimit) ? newFeeLimit : ZERO;
  }, [
    hasErrors,
    gasPrice,
    gasLimit,
    chainId,
    prefilledForm,
    isEgldTransaction,
    touched.gasLimit,
    data,
    receiver,
    amount
  ]);

  useEffect(() => {
    const isGasLimitChanged = getGasLimitChanged({
      initialValues,
      gasLimit,
      touched
    });

    if (!prefilledForm && isNftTransaction && !isGasLimitChanged) {
      handleUpdateGasLimit(
        new BigNumber(calculateNftGasLimit())
          .plus(guardedAccountGasLimit)
          .toString()
      );
    }
  }, [isNftTransaction, touched]);

  useEffect(() => {
    if (!prefilledForm) {
      handleUpdateGasLimit(getGasLimit({ txType, data, isGuarded }), true);
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
