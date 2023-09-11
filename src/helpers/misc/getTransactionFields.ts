import { ZERO } from '@multiversx/sdk-dapp/constants';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = (values: ExtendedValuesType) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when seding NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const { rawReceiverUsername, ...restOfValues } = values;

  const receiverUsername = isNftTransaction
    ? values.senderUsername
    : rawReceiverUsername;

  const parsedValues = {
    ...restOfValues,
    amount: actualTransactionAmount,
    receiverUsername
  };

  return parsedValues;
};
