import { Address } from '@multiversx/sdk-core';
import { IPlainTransactionObject } from '@multiversx/sdk-core/out';
import { TransactionsDataTokensType } from '@multiversx/sdk-dapp/out/types/transactions.types';
import { isContract } from '@multiversx/sdk-dapp/out/utils/validation/isContract';
import getTxWithReceiver from './getTxWithReceiver';

export interface ValidateReceiversType {
  transactions: IPlainTransactionObject[];
  txsDataTokens?: TransactionsDataTokensType;
  isMainnet: boolean;
  address: string;
  whitelistedReceivers?: string[];
}

export function validateReceivers({
  transactions: txs,
  txsDataTokens,
  isMainnet,
  address,
  whitelistedReceivers = []
}: ValidateReceiversType): boolean {
  if (isMainnet) {
    try {
      const transactions = txs.map((tx) => getTxWithReceiver({ address, tx }));

      const allTxReceiversWhitelisted =
        transactions.length === 0 ||
        transactions.every(
          ({ receiver }) =>
            receiver === address ||
            isContract(receiver) ||
            whitelistedReceivers.includes(receiver)
        );

      const dataFieldReceivers = txsDataTokens
        ? Object.values(txsDataTokens)
            .filter(({ receiver }) => Boolean(receiver))
            .map(({ receiver }) => new Address(receiver).bech32())
        : [];

      const receiversWhitelisted =
        dataFieldReceivers.length > 0
          ? dataFieldReceivers.every((receiver) => {
              const isWhitelisted =
                Boolean(receiver) && whitelistedReceivers.includes(receiver);
              return (
                receiver == null ||
                receiver === address ||
                isContract(receiver) ||
                isWhitelisted
              );
            })
          : true;

      const whitelisted = allTxReceiversWhitelisted && receiversWhitelisted;

      if (!whitelisted && process.env.NODE_ENV === 'development') {
        console.error('Receivers not whitelisted', {
          dataFieldReceivers,
          transactionReceviers: transactions.map(({ receiver }) => receiver)
        });
      }

      return whitelisted;
    } catch (err) {
      console.error('Unable to check whitelisted receivers', err);
      return false;
    }
  } else {
    return true;
  }
}

export default validateReceivers;
