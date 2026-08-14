import { Transaction, Address, TokenTransfer } from '@multiversx/sdk-core';
import { VERSION } from '@multiversx/sdk-dapp/out/constants/mvx.constants';
import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import BigNumber from 'bignumber.js';
import { stringToBytes } from 'helpers/transformations';

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
    data: stringToBytes(data.trim()),
    chainID: chainId,
    version: VERSION,
    relayer: relayer ? Address.newFromBech32(relayer) : undefined,
    relayerSignature: relayerSignature
      ? stringToBytes(relayerSignature)
      : undefined
  });

  return transaction;
}
