import { Transaction, Address, TokenTransfer } from '@multiversx/sdk-core';
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
    nonce: BigInt(nonce),
    value: TokenTransfer.newFromNativeAmount(BigInt(bNamount.toString(10)))
      .amount,
    sender: new Address(sender),
    receiver: new Address(receiver),
    gasPrice: BigInt(parseInt(gasPrice)),
    gasLimit: BigInt(parseInt(gasLimit)),
    senderUsername,
    receiverUsername,
    data: Buffer.from(data.trim()),
    chainID: chainId,
    version: VERSION
  });

  return transaction;
}
