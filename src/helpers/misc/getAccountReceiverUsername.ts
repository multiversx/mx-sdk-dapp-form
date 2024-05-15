import { getAccount } from '@multiversx/sdk-dapp/utils/account/getAccount';
import { getAccountByUsername } from 'apiCalls/account';

interface GetAccountReceiverUsernameType {
  rawReceiverUsername?: string;
  receiver?: string;
  receiverUsername?: string;
}

export const getAccountReceiverUsername = async ({
  rawReceiverUsername,
  receiver,
  receiverUsername
}: GetAccountReceiverUsernameType) => {
  if (receiverUsername) {
    let account = await getAccountByUsername(receiverUsername);

    if (account == null && receiver != null) {
      account = await getAccount(receiver);
    }

    if (account?.username) {
      return account.username;
    }
  }

  return rawReceiverUsername;
};
