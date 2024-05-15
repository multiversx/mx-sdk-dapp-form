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
  let account;
  const username = receiverUsername || rawReceiverUsername;

  if (username) {
    account = await getAccountByUsername(username);
  }

  // Get the account by address and use its username, in case the account is not found by specified username
  // This may happen if the username is not present or if it is a business/asset name.
  // The latter is not a valid username and should not be added in tha transaction
  if (!account && Boolean(receiver)) {
    account = await getAccount(receiver);
  }

  return account?.username;
};
