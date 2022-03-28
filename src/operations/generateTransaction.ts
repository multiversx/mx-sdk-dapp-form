import { getAccount, getLatestNonce, nominate } from '@elrondnetwork/dapp-core';
import { prepareTransaction } from 'hooks/useFetchGasLimit/prepareTransaction';
import { TxTypeEnum, ExtendedValuesType } from 'types';

interface GenerateTransactionPropsType {
  address: string;
  balance: string;
  chainId: string;
  values: ExtendedValuesType;
}

export async function generateTransaction(props: GenerateTransactionPropsType) {
  const { address, balance, chainId, values } = props;
  const {
    amount: amountValue,
    receiver,
    data,
    gasLimit,
    gasPrice,
    nft,
    txType
  } = values;
  const account = await getAccount(address);
  const latestNonce = getLatestNonce(account);
  const amount = txType === TxTypeEnum.EGLD ? amountValue : '0';
  // const tokenAmount =
  //   isEsdtTransaction || computedNft.found ? amountValue : '0';
  const transactionReceiver = Boolean(nft) ? address : receiver;

  try {
    const transaction = prepareTransaction({
      balance,
      amount: String(amount), // TODO: check
      gasLimit: String(gasLimit),
      gasPrice: nominate(gasPrice),
      data: data.trim(),
      receiver: transactionReceiver,
      nonce: latestNonce,
      chainId
    });

    return transaction;
  } catch (err) {
    console.log('Prepare transaction error', err);
    throw err;
  }
}
