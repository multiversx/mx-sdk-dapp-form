import { ZERO } from '@multiversx/sdk-dapp/constants';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';
import { getAccountReceiverUsername } from './getAccountReceiverUsername';

export const getTransactionFields = async (values: ExtendedValuesType) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when seding NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const { rawReceiverUsername, ...restOfValues } = values;

  const realReceiverUsername = await getAccountReceiverUsername({
    rawReceiverUsername,
    receiver: values.receiver,
    receiverUsername: values.receiverUsername
  });

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
