import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';
import { ServerTransactionType } from '@multiversx/sdk-dapp/types';

import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';

export const formatAddressesFromTransactions = (
  transactions: ServerTransactionType[]
): KnowAddressType[] =>
  transactions.reduce(
    (previous: KnowAddressType[], current: ServerTransactionType) => {
      const receiver: KnowAddressType = {
        address: current.receiver,
        username: trimUsernameDomain(current.receiverAssets?.name)
      };

      const sender: KnowAddressType = {
        address: current.sender,
        username: trimUsernameDomain(current.senderAssets?.name)
      };

      return current ? [...previous, receiver, sender] : previous;
    },
    []
  );
