import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useSelector } from 'react-redux';
import { formSelector, networksSelector } from 'redux/selectors';
import { computeInitGasLimit } from 'logic/operations';

export function useComputeGasLimit() {
  const { activeNetwork } = useSelector(networksSelector);
  const { chainId, delegationContract, egldLabel } = activeNetwork;
  const {
    address,
    account: { nonce, balance }
  } = useGetAccountInfo();

  const { receiver, amount, gasLimit, gasPrice, data } =
    useSelector(formSelector);

  const isInternal = ['mainnet', 'testnet'].includes(activeNetwork.id); // TODO: selector

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
      computedTokenId
    });
    return { initGasLimit, initGasLimitError };
  };

  return computeGasLimit;
}

export default useComputeGasLimit;
