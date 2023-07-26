import { ServerTransactionType } from '@multiversx/sdk-dapp/types';

import { trimReceiverDomain } from 'contexts/ReceiverContext/helpers';
import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';

export const formatAddressesFromTransactions = (
  transactions: ServerTransactionType[]
): KnowAddressType[] =>
  transactions.reduce(
    (previous: KnowAddressType[], current: ServerTransactionType) => {
      const receiver: KnowAddressType = {
        address: current.receiver,
        username: trimReceiverDomain(current.receiverAssets?.name)
      };

      const sender: KnowAddressType = {
        address: current.sender,
        username: trimReceiverDomain(current.senderAssets?.name)
      };

      return current ? [...previous, receiver, sender] : previous;
    },
    []
  );
