import { ZERO } from '@multiversx/sdk-dapp/constants';
import { getAccount } from '@multiversx/sdk-dapp/utils/account/getAccount';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = async (values: ExtendedValuesType) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when seding NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const { rawReceiverUsername, ...restOfValues } = values;

  const receiverAccount = await getAccount(values.receiver);
  const realReceiverUsername = receiverAccount?.username;

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
