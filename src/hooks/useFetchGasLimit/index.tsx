import { useEffect, useState } from 'react';
import { MAINNET_CHAIN_ID } from '@multiversx/sdk-dapp/out/constants';
import { isContract } from '@multiversx/sdk-dapp/out/utils/validation/isContract';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { useAccountContext } from 'contexts/AccountContext';
import { useFormContext } from 'contexts/FormContext/FormContext';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import { getGasLimitChanged } from 'helpers';
import { ExtendedValuesType, ValuesEnum } from 'types/form';
import { fetchGasLimit } from './fetchGasLimit';
import useDebounce from './useDebounce';

const ms500 = process.env.NODE_ENV !== 'test' ? 500 : 1;

export function useFetchGasLimit(
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError']
) {
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const { prefilledForm } = useFormContext();
  const formikContext = useFormikContext<ExtendedValuesType>();
  const { balance, address, nonce } = useAccountContext();

  const {
    values,
    initialValues,
    touched,
    errors: { gasLimit: gasLimitError, amount: amountError },
    setFieldValue
  } = formikContext;

  const { data, amount, gasLimit } = values;
  const debouncedData = useDebounce(data, ms500);
  const debouncedAmount = useDebounce(amount, ms500);
  const debouncedGasLimit = useDebounce(gasLimit, ms500);
  const [gasCostLoading, setGasCostLoading] = useState(false);
  const [gasCostError, setGasCostError] = useState(initGasLimitError);

  const getGasCost = async () => {
    const hasErrors = gasLimitError || amountError;
    const hasData = debouncedData.length > 0;
    const hasAmount = new BigNumber(debouncedAmount).isGreaterThanOrEqualTo(0);
    const isGasLimitChanged = getGasLimitChanged({
      initialValues,
      gasLimit,
      touched
    });
    const isDevelopment =
      chainId !== MAINNET_CHAIN_ID || process.env.NODE_ENV === 'test';

    const shouldFetchGasLimit =
      !prefilledForm &&
      isContract(values.receiver) &&
      isDevelopment && // TODO: remove when ready
      !isGasLimitChanged &&
      !hasErrors &&
      hasData &&
      hasAmount;

    if (shouldFetchGasLimit) {
      setGasCostLoading(true);

      try {
        const { gasLimit: resultedGasLimit, gasLimitCostError: error } =
          await fetchGasLimit({
            balance,
            address,
            nonce,
            values,
            chainId
          });

        setGasCostLoading(false);
        setGasCostError(error);
        setFieldValue(ValuesEnum.gasLimit, resultedGasLimit, true);
      } catch (err) {
        setGasCostLoading(false);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getGasCost();
  }, [
    debouncedData,
    debouncedAmount,
    debouncedGasLimit,
    values.receiver,
    prefilledForm
  ]);

  return { gasCostLoading, gasCostError };
}

export default useFetchGasLimit;
