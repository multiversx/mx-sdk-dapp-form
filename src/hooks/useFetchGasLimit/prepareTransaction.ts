import * as constants from '@elrondnetwork/dapp-core/constants';
import { nominate } from '@elrondnetwork/dapp-core/utils';
import {
  Transaction,
  TransactionPayload,
  TransactionVersion,
  Address,
  TokenPayment
} from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';

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
    nonce: nonce,
    value: TokenPayment.egldFromBigInteger(bNamount.toString(10)),
    receiver: new Address(to),
    gasPrice: parseInt(gasPrice),
    gasLimit: parseInt(gasLimit),
    data: new TransactionPayload(data),
    chainID: chainId,
    version: new TransactionVersion(constants.version)
  });

  return transaction;
}
