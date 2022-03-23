import { useState, useEffect } from 'react';
import { isContract, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useSelector } from 'react-redux';
import {
  formSelector,
  hookTypeSelector,
  networksSelector
} from 'redux/selectors';
import { HooksEnum } from 'routes';

export function useCheckReceiverAllowed() {
  const [receiverAllowed, setReceiverAllowed] = useState(true);
  const hook = useSelector(hookTypeSelector);
  const { activeNetwork } = useSelector(networksSelector);
  const { id: activeNetworkId, hookWhitelist } = activeNetwork;
  const { data, receiver } = useSelector(formSelector);
  const { address } = useGetAccountInfo();

  useEffect(() => {
    if (
      (hook === HooksEnum.sign || hook === HooksEnum.transaction) &&
      activeNetworkId === 'mainnet' &&
      hookWhitelist &&
      data &&
      (data.startsWith('ESDTNFTCreate@') ||
        data.startsWith('ESDTNFTTransfer@')) &&
      !([...hookWhitelist, address].includes(receiver) || isContract(receiver))
    ) {
      setReceiverAllowed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return receiverAllowed;
}
