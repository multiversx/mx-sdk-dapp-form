import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';
import { ServerTransactionType } from '@multiversx/sdk-dapp/types';
import { isContract } from '@multiversx/sdk-dapp/utils';

import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';

export const formatAddressesFromTransactions = (
  transactions: ServerTransactionType[]
): KnowAddressType[] =>
  transactions.reduce(
    (previous: KnowAddressType[], current: ServerTransactionType) => {
      const receiverUsername = current.receiverAssets?.name;
      const senderUsername = current.senderAssets?.name;
      const receiverHeroTag = trimUsernameDomain(receiverUsername);
      const senderHeroTag = trimUsernameDomain(senderUsername);

      // Only usernames that end with .elrond are valid usernames; asset names should be skipped
      // Currently, both usernames and asset names come into the receiverAssets and senderAssets
      const shouldSkipReceiverUsername =
        isContract(current.receiver) || receiverUsername === receiverHeroTag;
      const shouldSkipSenderUsername =
        isContract(current.sender) || senderUsername === senderHeroTag;

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
