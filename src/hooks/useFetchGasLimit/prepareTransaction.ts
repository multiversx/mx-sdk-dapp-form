import {
  Transaction,
  TransactionPayload,
  TransactionVersion,
  Address,
  TokenPayment
} from '@multiversx/sdk-core';
import { VERSION } from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';
import { parseAmount } from 'helpers';

interface PrepareTransactionType {
  balance: string;
  amount: string;
  receiver: string;
  sender: string;
  senderUsername?: string;
  receiverUsername?: string;
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
  receiverUsername,
  sender,
  senderUsername,
  gasPrice,
  gasLimit,
  chainId
}: PrepareTransactionType) {
  const bNamount = new BigNumber(parseAmount(amount));

  const transaction = new Transaction({
    nonce: nonce,
    value: TokenPayment.egldFromBigInteger(bNamount.toString(10)),
    sender: Address.newFromBech32(sender),
    receiver: Address.newFromBech32(receiver),
    gasPrice: parseInt(gasPrice),
    gasLimit: parseInt(gasLimit),
    senderUsername,
    receiverUsername,
    data: new TransactionPayload(data),
    chainID: chainId,
    version: new TransactionVersion(VERSION)
  });

  return transaction;
}
