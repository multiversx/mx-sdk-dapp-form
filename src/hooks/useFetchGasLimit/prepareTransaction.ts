import { nominate } from '@elrondnetwork/dapp-core';
import {
  Transaction,
  Nonce,
  Balance,
  GasPrice,
  GasLimit,
  TransactionPayload,
  ChainID,
  TransactionVersion,
  Address
} from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';
import { version } from 'constants/index';

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
  const bNamount = new BigNumber(nominate(amount));

  const to = receiver;

  const transaction = new Transaction({
    nonce: new Nonce(nonce),
    value: Balance.fromString(bNamount.toString(10)),
    receiver: new Address(to),
    gasPrice: new GasPrice(parseInt(gasPrice)),
    gasLimit: new GasLimit(parseInt(gasLimit)),
    data: new TransactionPayload(data),
    chainID: new ChainID(chainId),
    version: new TransactionVersion(version)
  });

  return transaction;
}
