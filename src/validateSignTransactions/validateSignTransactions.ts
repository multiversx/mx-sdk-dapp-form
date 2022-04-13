import {
  addressIsValid,
  getTokenFromData,
  MultiSignTxType,
  parseMultiEsdtTransferData,
  TxsDataTokensType
} from '@elrondnetwork/dapp-core';
import { isNftOrMultiEsdtTx } from './helpers';
import newTransaction from './newTransaction';
import {
  ValidateSignTransactionsType,
  validateTransaction
} from './validateTransaction';

export async function validateSignTransactions(
  props: ValidateSignTransactionsType
) {
  const { extractedTxs, address, egldLabel, balance, chainId, apiConfig } =
    props;
  let txsDataTokens: TxsDataTokensType = {};
  let allErrors: { [key: string]: string } = {};
  const allTransactions: MultiSignTxType[] = [];

  const transactions = extractedTxs.map((tx) => {
    return {
      ...tx,
      receiver:
        isNftOrMultiEsdtTx(tx.data) && !addressIsValid(String(tx.receiver))
          ? address
          : String(tx.receiver)
    };
  });

  if (transactions && transactions.length > 0) {
    transactions.forEach((tx, i) => {
      const transaction = { ...tx, receiver: tx.receiver || address };
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
              tokenId: trx.token ? trx.token : '',
              amount: trx.amount ? trx.amount : '',
              type: trx.type,
              nonce: trx.nonce ? trx.nonce : '',
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
