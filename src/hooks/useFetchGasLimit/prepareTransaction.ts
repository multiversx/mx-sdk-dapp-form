import { VERSION } from '@elrondnetwork/dapp-core/constants/index';
import {
  Transaction,
  TransactionPayload,
  TransactionVersion,
  Address,
  TokenPayment
} from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';
import { parseAmount } from 'helpers';

interface PrepareTransactionType {
  balance: string;
  amount: string;
  receiver: string;
  data: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  chainId: string;
}
export function prepareTransaction({
  amount,
  data,
  nonce,
  receiver,
  gasPrice,
  gasLimit,
  chainId
}: PrepareTransactionType) {
  const bNamount = new BigNumber(parseAmount(amount));

  const to = receiver;

  const transaction = new Transaction({
    nonce: nonce,
    value: TokenPayment.egldFromBigInteger(bNamount.toString(10)),
    receiver: new Address(to),
    gasPrice: parseInt(gasPrice),
    gasLimit: parseInt(gasLimit),
    data: new TransactionPayload(data),
    chainID: chainId,
    version: new TransactionVersion(VERSION)
  });

  return transaction;
}
