import { useNetworkConfigContext } from 'contexts';
import { useAccountContext } from 'contexts/AccountContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { computeInitGasLimit } from 'operations';

export function useComputeGasLimit() {
  const { balance, address, nonce } = useAccountContext();
  const { networkConfig, delegationContractData } = useNetworkConfigContext();
  const sendFormContext = useSendFormContext();
  const {
    receiverInfo: { receiver },
    amount: { amount: amount },
    gasInfo: { gasLimit, gasPrice },
    dataFieldInfo: { data }
  } = sendFormContext;

  const isInternal = ['mainnet', 'testnet'].includes(networkConfig.id); // TODO: selector

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
    delegationContractData,
    chainId: networkConfig.id,
    egldLabel: networkConfig.egldLabel
  };

  return async function computeGasLimit(computedTokenId: string) {
    const { initGasLimit, initGasLimitError } = await computeInitGasLimit({
      ...props,
      computedTokenId
    });
    return { initGasLimit, initGasLimitError };
  };
}

export default useComputeGasLimit;
