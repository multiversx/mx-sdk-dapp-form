import { useAccountContext } from 'contexts/AccountContext';
import { useApiContext } from 'contexts/ApiContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { computeInitGasLimit } from 'operations';

export function useComputeGasLimit() {
  // TODO @stan
  const activeNetwork = {
    id: 'TODO',
    delegationContract: 'TODO',
    egldLabel: 'TODO'
  };

  const { id: activeNetworkId, delegationContract, egldLabel } = activeNetwork;

  const { chainId, balance, address, nonce } = useAccountContext();
  const apiProps = useApiContext();
  const {
    receiverInfo: { receiver },
    amount: { value: amount },
    gasInfo: { gasLimit, gasPrice },
    dataFieldInfo: { data }
  } = useSendFormContext();

  const isInternal = ['mainnet', 'testnet'].includes(activeNetworkId); // TODO: selector

  const props = {
    receiver,
    isInternal,
    balance,
    address,
    nonce,
    amount,
    data,
    gasLimit,
    gasPrice,
    delegationContract,
    chainId,
    egldLabel
  };

  const computeGasLimit = async (computedTokenId: string) => {
    const { initGasLimit, initGasLimitError } = await computeInitGasLimit({
      ...props,
      computedTokenId,
      apiProps
    });
    return { initGasLimit, initGasLimitError };
  };

  return computeGasLimit;
}

export default useComputeGasLimit;
