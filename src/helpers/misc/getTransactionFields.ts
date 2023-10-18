import { ZERO } from '@multiversx/sdk-dapp/constants';
import { getAccountByUsername } from 'apiCalls/account';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = async (values: ExtendedValuesType) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when seding NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const { rawReceiverUsername, ...restOfValues } = values;
  let realReceiverUsername = rawReceiverUsername;

  if (values.receiverUsername) {
    const account = await getAccountByUsername(values.receiverUsername);
    if (account == null) {
      realReceiverUsername = undefined;
    }
  }

  const receiverUsername = isNftTransaction
    ? values.senderUsername
    : realReceiverUsername;

  const parsedValues = {
    ...restOfValues,
    amount: actualTransactionAmount,
    receiverUsername
  };

  return parsedValues;
};
