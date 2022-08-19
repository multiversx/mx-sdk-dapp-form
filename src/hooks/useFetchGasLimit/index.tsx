import { useEffect, useState } from 'react';
import { mainnetChainId } from '@elrondnetwork/dapp-core/constants';
import { isContract } from '@elrondnetwork/dapp-core/utils/smartContracts';
import { useFormikContext } from 'formik';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { useAccountContext } from 'contexts/AccountContext';
import { useFormContext } from 'contexts/FormContext/FormContext';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
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
    touched,
    errors: { gasLimit: gasLimitError, amount: amountError },
    setFieldValue
  } = formikContext;

  const { data, amount } = values;
  const debouncedData = useDebounce(data, ms500);
  const debouncedAmount = useDebounce(amount, ms500);
  const [gasCostLoading, setGasCostLoading] = useState(false);
  const [gasCostError, setGasCostError] = useState(initGasLimitError);

  useEffect(() => {
    const hasErrors = gasLimitError || amountError;
    if (
      !prefilledForm &&
      isContract(values.receiver) &&
      (chainId !== mainnetChainId || process.env.NODE_ENV === 'test') && // TODO: remove when ready
      !touched.gasLimit &&
      !hasErrors &&
      debouncedData.length > 0
    ) {
      setGasCostLoading(true);
      fetchGasLimit({
        balance,
        address,
        nonce,
        values,
        chainId
      })
        .then(({ gasLimit: resultedGasLimit, gasLimitCostError: error }) => {
          setGasCostLoading(false);
          setGasCostError(error);
          setFieldValue(ValuesEnum.gasLimit, resultedGasLimit, true);
        })
        .catch((err) => {
          setGasCostLoading(false);
          console.error(err);
        });
    }
  }, [debouncedData, debouncedAmount, values.receiver]);

  return { gasCostLoading, gasCostError };
}

export default useFetchGasLimit;
