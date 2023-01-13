import { VERSION } from '@multiversx/sdk-dapp/constants/index';
import {
  Transaction,
  TransactionPayload,
  TransactionVersion,
  Address,
  TokenPayment
} from '@multiversx/sdk-core';
import BigNumber from 'bignumber.js';
import { parseAmount } from 'helpers';

interface PrepareTransactionType {
  balance: string;
  amount: string;
  receiver: string;
  sender: string;
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
  sender,
  gasPrice,
  gasLimit,
  chainId
}: PrepareTransactionType) {
  const bNamount = new BigNumber(parseAmount(amount));

  const transaction = new Transaction({
    nonce: nonce,
    value: TokenPayment.egldFromBigInteger(bNamount.toString(10)),
    sender: new Address(sender),
    receiver: new Address(receiver),
    gasPrice: parseInt(gasPrice),
    gasLimit: parseInt(gasLimit),
    data: new TransactionPayload(data),
    chainID: chainId,
    version: new TransactionVersion(VERSION)
  });

  return transaction;
}
