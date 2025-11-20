import { KnowAddressType } from 'contexts/ReceiverContext/receiverContext.types';

export interface GetReceiverUsernameType {
  knownAddresses: KnowAddressType[] | null;
  receiverAddress: string;
  existingReceiverUsername?: string;
}

export const getReceiverUsername = ({
  receiverAddress,
  knownAddresses,
  existingReceiverUsername
}: GetReceiverUsernameType) => {
  if (existingReceiverUsername) {
    return existingReceiverUsername;
  }

  const currentKnowAccount = knownAddresses?.find(
    (account) => account.address === receiverAddress
  );

  return currentKnowAccount?.username;
};
