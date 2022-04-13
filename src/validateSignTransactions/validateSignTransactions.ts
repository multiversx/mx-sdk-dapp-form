import {
  addressIsValid,
  getTokenFromData,
  MultiSignTxType,
  parseMultiEsdtTransferData,
  TxsDataTokensType,
  models
} from '@elrondnetwork/dapp-core';
import { isNftOrMultiEsdtTx } from 'validation';
import {
  ValidateSignTransactionsType,
  validateTransaction
} from './validateTransaction';

const { newTransaction } = models;

export async function validateSignTransactions(
  props: ValidateSignTransactionsType
) {
  const { extractedTxs, address, egldLabel, balance, chainId, apiConfig } =
    props;
  let txsDataTokens: TxsDataTokensType = {};
  let allErrors: { [key: string]: string } = {};
  const allTransactions: MultiSignTxType[] = [];

  if (extractedTxs && extractedTxs.length > 0) {
    extractedTxs.forEach((tx, i) => {
      const receiver =
        isNftOrMultiEsdtTx(tx.data) && !addressIsValid(String(tx.receiver))
          ? address
          : String(tx.receiver);
      const transaction = { ...tx, receiver };
      const multiTxs = parseMultiEsdtTransferData(transaction.data);

      if (multiTxs.length > 0) {
        multiTxs.forEach((trx) => {
          const newTx: MultiSignTxType = {
            ...transaction,
            transaction: newTransaction(trx),
            multiTxData: trx.data,
            transactionIndex: i
          };

          txsDataTokens = {
            ...txsDataTokens,
            [trx.data]: {
              tokenId: trx.token || '',
              amount: trx.amount || '',
              type: trx.type,
              nonce: trx.nonce || '',
              multiTxData: trx.data,
              receiver: trx.receiver
            }
          };

          allTransactions.push(newTx);
        });
      } else {
        const { tokenId, amount } = getTokenFromData(transaction.data);
        if (tokenId) {
          txsDataTokens = {
            ...txsDataTokens,
            [transaction.data]: { tokenId, amount }
          };
        }
        allTransactions.push({
          ...transaction,
          transactionIndex: i,
          transaction: newTransaction({ ...transaction, chainId })
        });
      }
    });

    const promises = allTransactions.map((tx) => {
      return validateTransaction({
        tx,
        txsDataTokens,
        address,
        egldLabel,
        balance,
        chainId,
        apiConfig
      });
    });

    const results = await Promise.all(promises);

    for (const errors of results) {
      allErrors = { ...allErrors, ...errors };
    }

    return {
      txsDataTokens,
      errors: allErrors,
      parsedTransactions: allTransactions
    };
  }
  return null;
}
