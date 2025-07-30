import { Transaction, Address, TokenTransfer } from '@multiversx/sdk-core';
import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import { VERSION } from '@multiversx/sdk-dapp/out/constants';
import BigNumber from 'bignumber.js';

interface PrepareTransactionType {
  balance: string;
  amount: string;
  receiver: string;
  sender: string;
  senderUsername?: string;
  receiverUsername?: string;
  relayer?: string;
  relayerSignature?: string;
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
  chainId,
  relayer,
  relayerSignature
}: PrepareTransactionType) {
  const bNamount = new BigNumber(parseAmount(amount));

  const transaction = new Transaction({
    nonce: BigInt(nonce),
    value: TokenTransfer.newFromNativeAmount(BigInt(bNamount.toString(10)))
      .amount,
    sender: Address.newFromBech32(sender),
    receiver: Address.newFromBech32(receiver),
    gasPrice: BigInt(parseInt(gasPrice)),
    gasLimit: BigInt(parseInt(gasLimit)),
    senderUsername,
    receiverUsername,
    data: Buffer.from(data.trim()),
    chainID: chainId,
    version: VERSION,
    relayer: relayer ? Address.newFromBech32(relayer) : undefined,
    relayerSignature: relayerSignature
      ? Buffer.from(relayerSignature)
      : undefined
  });

  return transaction;
}
