import { prepareTransaction } from 'hooks/useFetchGasLimit/prepareTransaction';
import { ExtendedValuesType } from 'types';
import { getParsedGasPrice } from './getParsedGasPrice';

interface GenerateTransactionPropsType {
  address: string;
  balance: string;
  chainId: string;
  nonce: number;
  values: ExtendedValuesType;
}

export async function generateTransaction(props: GenerateTransactionPropsType) {
  const { address, balance, chainId, nonce, values } = props;
  const {
    amount,
    receiver,
    data,
    gasLimit,
    gasPrice,
    nft,
    receiverUsername,
    senderUsername,
    relayer
  } = values;
  const transactionReceiver = Boolean(nft) ? address : receiver;

  try {
    const transaction = prepareTransaction({
      balance,
      amount: String(amount),
      gasLimit: String(gasLimit),
      gasPrice: getParsedGasPrice(gasPrice),
      data: data.trim(),
      receiver: transactionReceiver,
      receiverUsername,
      senderUsername,
      sender: address,
      nonce,
      chainId,
      relayer
    });

    return transaction;
  } catch (err) {
    console.log('Prepare transaction error', err);
    throw err;
  }
}
