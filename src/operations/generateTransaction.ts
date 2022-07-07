import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { prepareTransaction } from 'hooks/useFetchGasLimit/prepareTransaction';
import { ExtendedValuesType } from 'types';

interface GenerateTransactionPropsType {
  address: string;
  balance: string;
  chainId: string;
  nonce: number;
  values: ExtendedValuesType;
}

export async function generateTransaction(props: GenerateTransactionPropsType) {
  const { address, balance, chainId, nonce, values } = props;
  const { amount, receiver, data, gasLimit, gasPrice, nft } = values;
  const transactionReceiver = Boolean(nft) ? address : receiver;

  try {
    const transaction = prepareTransaction({
      balance,
      amount: String(amount),
      gasLimit: String(gasLimit),
      gasPrice: nominate(gasPrice),
      data: data.trim(),
      receiver: transactionReceiver,
      nonce,
      chainId
    });

    return transaction;
  } catch (err) {
    console.log('Prepare transaction error', err);
    throw err;
  }
}
