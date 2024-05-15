import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';
import { ServerTransactionType } from '@multiversx/sdk-dapp/types';
import { isContract } from '@multiversx/sdk-dapp/utils';

import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';

export const formatAddressesFromTransactions = (
  transactions: ServerTransactionType[]
): KnowAddressType[] =>
  transactions.reduce(
    (previous: KnowAddressType[], current: ServerTransactionType) => {
      // Currently, both usernames and asset names come into the receiverAssets and senderAssets
      const receiverUsername = current.receiverAssets?.name;
      const senderUsername = current.senderAssets?.name;
      const receiverHeroTag = trimUsernameDomain(receiverUsername);
      const senderHeroTag = trimUsernameDomain(senderUsername);

      const shouldSkipReceiverUsername = isContract(current.receiver);
      const shouldSkipSenderUsername = isContract(current.sender);

      const receiver: KnowAddressType = {
        address: current.receiver,
        username: shouldSkipReceiverUsername ? undefined : receiverHeroTag,
        rawUsername: shouldSkipReceiverUsername ? undefined : receiverUsername
      };

      const sender: KnowAddressType = {
        address: current.sender,
        username: shouldSkipSenderUsername ? undefined : senderHeroTag,
        rawUsername: shouldSkipSenderUsername ? undefined : senderUsername
      };

      return current ? [...previous, receiver, sender] : previous;
    },
    []
  );
