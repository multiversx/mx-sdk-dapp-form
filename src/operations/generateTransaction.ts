import { getAccount, getLatestNonce, nominate } from '@elrondnetwork/dapp-core';
import { TxTypeEnum, ValuesType } from 'logic/types';
import { prepareTransaction } from 'hooks/useFetchGasLimit/prepareTransaction';
import { NftType } from 'types';

interface GenerateTransactionPropsType {
  nft?: NftType;
  address: string;
  balance: string;
  chainId: string;
  txType: TxTypeEnum;
  values: ValuesType;
}

export async function generateTransaction(props: GenerateTransactionPropsType) {
  const { nft, address, balance, chainId, txType, values } = props;
  const { amount: amountValue, receiver, data, gasLimit, gasPrice } = values;
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
