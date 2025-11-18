import { getAccountFromApi } from '@multiversx/sdk-dapp/out/apiCalls/account/getAccountFromApi';
import { ZERO } from '@multiversx/sdk-dapp-utils/out/constants';
import { getIsNftTransaction } from 'helpers/misc/getIsNftTransaction';
import { TransactionTypeEnum } from 'types/enums';
import { ExtendedValuesType } from 'types/form';

export const getTransactionFields = async (
  values: ExtendedValuesType,
  options?: {
    apiAddress?: string;
  }
) => {
  const baseURL = options?.apiAddress?.trim();

  if (!baseURL) {
    throw new Error(
      'getTransactionFields requires a non-empty apiAddress to fetch the receiver account.'
    );
  }

  const actualTransactionAmount =
    values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;

  // when sending NFTs, receiver is self
  const isNftTransaction = getIsNftTransaction(values.txType);
  let receiverAccount = null;

  try {
    receiverAccount = await getAccountFromApi({
      address: values.receiver,
      baseURL
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : JSON.stringify(error);

    throw new Error(
      `Failed to fetch receiver account (${values.receiver}) from ${baseURL}: ${reason}`
    );
  }

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
