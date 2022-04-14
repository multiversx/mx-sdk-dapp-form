import { isContract, TxsDataTokensType } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs';
import getTxWithReceiver from './getTxWithReceiver';
import { SignTxType } from './validateTransaction';

interface ValidateReceiversType {
  transactions: SignTxType[];
  txsDataTokens?: TxsDataTokensType;
  isMainnet: boolean;
  address: string;
}

export function validateReceivers({
  transactions: txs,
  txsDataTokens,
  isMainnet,
  address
}: ValidateReceiversType): boolean {
  if (isMainnet) {
    try {
      const transactions = txs.map((tx) => getTxWithReceiver({ address, tx }));

      const allTxReceiversWhitelisted =
        transactions.length === 0 ||
        transactions.every(({ receiver }) => {
          const isWhitelisted = receiver === address || isContract(receiver);
          return isWhitelisted;
        });

      const dataFieldReceivers = txsDataTokens
        ? Object.values(txsDataTokens)
            .filter(({ receiver }) => Boolean(receiver))
            .map(({ receiver }) => new Address(receiver).bech32())
        : [];

      const receiversWhitelisted =
        dataFieldReceivers.length > 0
          ? dataFieldReceivers.every((receiver) => {
              const result =
                receiver == null ||
                receiver === address ||
                isContract(receiver);

              return result;
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
