import { ZERO } from '@multiversx/sdk-dapp-utils/out';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = async (
  values: ExtendedValuesType,
  options?: {
    apiAddress?: string;
  }
) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when sending NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const receiverAccount = await getAccount(values.receiver, options);
  const realReceiverUsername = receiverAccount?.username;

  const receiverUsername = isNftTransaction
    ? values.senderUsername
    : realReceiverUsername;

  const parsedValues = {
    ...values,
    amount: actualTransactionAmount,
    receiverUsername,
    relayer: values.relayer,
    relayerSignature: values.relayerSignature
  };

  delete parsedValues.rawReceiverUsername;

  return parsedValues;
};
