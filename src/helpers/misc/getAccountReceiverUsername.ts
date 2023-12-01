import { getAccountByUsername } from 'apiCalls/account';

interface GetAccountReceiverUsernameType {
  rawReceiverUsername?: string;
  receiverUsername?: string;
}

export const getAccountReceiverUsername = async ({
  receiverUsername,
  rawReceiverUsername
}: GetAccountReceiverUsernameType) => {
  if (receiverUsername) {
    const account = await getAccountByUsername(receiverUsername);

    if (account == null) {
      return undefined;
    }
    if (account?.username) {
      return account.username;
    }
  }

  return rawReceiverUsername;
};
