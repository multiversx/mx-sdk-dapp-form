import { useEffect, useState } from 'react';
import { isContract } from '@elrondnetwork/dapp-core';
import {
  fetchGasLimit,
  FetchGasLimitType
} from 'hooks/useFetchGasLimit/fetchGasLimit';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';

interface UseFetchGasLimitProps extends FetchGasLimitType {
  receiver: string;
  gasLimitTouched: boolean;
  amountError: boolean;
  gasLimitError: boolean;
  prefilledForm: boolean;
  receiverIsContract: boolean;
  gasLimitCostError: string | null;
}

const ms500 = process.env.NODE_ENV !== 'test' ? 500 : 10;

export function useFetchGasLimit(props: UseFetchGasLimitProps) {
  const {
    values,
    gasLimitTouched,
    amountError,
    gasLimitError,
    receiver,
    gasLimitCostError,
    prefilledForm,
    chainId
  } = props;
  const { data, amount } = values;
  const debouncedData = useDebounce(data, ms500);
  const debouncedAmount = useDebounce(amount, ms500);
  const [gasCostLoading, setGasCostLoading] = useState(false);
  const [gasCostError, setGasCostError] = useState(gasLimitCostError);
  const [gasCostLimit, setGasCostLimit] = useState(values.gasLimit);

  useEffect(() => {
    const hasErrors = gasLimitError || amountError;
    if (
      !prefilledForm &&
      isContract(receiver) &&
      (chainId !== '1' || process.env.NODE_ENV === 'test') && // TODO: remove when ready
      !gasLimitTouched &&
      !hasErrors &&
      debouncedData.length > 0
    ) {
      setGasCostLoading(true);
      fetchGasLimit(props)
        .then(({ gasLimit: resultedGasLimit, gasLimitCostError: error }) => {
          setGasCostLoading(false);
          setGasCostError(error ?? null);
          setGasCostLimit(resultedGasLimit);
        })
        .catch((err) => {
          setGasCostLoading(false);
          console.error(err);
        });
    }
  }, [debouncedData, debouncedAmount, receiver]);

  return { gasCostLoading, gasCostError, gasCostLimit };
}

export default useFetchGasLimit;
