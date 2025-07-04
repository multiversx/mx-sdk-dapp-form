import { getAccountFromApi } from '@multiversx/sdk-dapp';
import { ZERO } from '@multiversx/sdk-dapp-utils/out/constants';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = async (
  values: ExtendedValuesType,
  options?: {
    apiAddress?: string;
    headers?: Record<string, string>;
  }
) => {
  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when sending NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  const receiverAccount = await getAccountFromApi({
    address: values.receiver,
    baseURL: options?.apiAddress ?? '',
    headers: options?.headers
  });
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
