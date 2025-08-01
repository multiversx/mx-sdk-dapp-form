import { IPlainTransactionObject, Transaction } from '@multiversx/sdk-core/out';

import { getTokenFromData } from '@multiversx/sdk-dapp/out/providers/strategies/helpers/signTransactions/helpers/getMultiEsdtTransferData/helpers/getTokenFromData';
import { parseMultiEsdtTransferData } from '@multiversx/sdk-dapp/out/providers/strategies/helpers/signTransactions/helpers/getMultiEsdtTransferData/helpers/parseMultiEsdtTransferData';
import {
  MultiEsdtTransactionType,
  MultiSignTransactionType,
  TransactionDataTokenType,
  TransactionsDataTokensType
} from '@multiversx/sdk-dapp/out/types/transactions.types';
import getTxWithReceiver from './getTxWithReceiver';
import {
  ValidateSignTransactionsType,
  validateTransaction
} from './validateTransaction';

function processMultiTx(props: {
  trx: MultiEsdtTransactionType;
  transaction: IPlainTransactionObject;
  transactionIndex: number;
}) {
  const { transaction, transactionIndex, trx } = props;
  const newTx: MultiSignTransactionType = {
    ...transaction,
    transaction: Transaction.newFromPlainObject(transaction),
    multiTxData: trx.data,
    transactionIndex,
    needsSigning: true
  };

  return {
    newTx,
    txsData: {
      [trx.data]: {
        tokenId: trx.token || '',
        amount: trx.amount || '',
        type: trx.type,
        nonce: trx.nonce || '',
        multiTxData: trx.data,
        receiver: trx.receiver
      }
    }
  };
}

function extractAllTransactions(props: ValidateSignTransactionsType) {
  const { extractedTxs, address, chainId } = props;
  let txsDataTokens: TransactionsDataTokensType = {};
  const allTransactions: MultiSignTransactionType[] = [];

  extractedTxs.forEach((tx, transactionIndex) => {
    const transaction = getTxWithReceiver({ address, tx });
    const multiTxs = parseMultiEsdtTransferData(transaction.data);

    if (multiTxs.length > 0) {
      multiTxs.forEach((trx) => {
        const { newTx, txsData } = processMultiTx({
          trx,
          transaction,
          transactionIndex
        });

        txsDataTokens = {
          ...txsDataTokens,
          ...txsData
        };

        allTransactions.push(newTx);
      });
    } else {
      const { tokenId, amount } = getTokenFromData(transaction.data);
      if (tokenId && transaction.data) {
        txsDataTokens = {
          ...txsDataTokens,
          [transaction.data]: {
            tokenId,
            amount,
            receiver: transaction.receiver
          }
        };
      }

      allTransactions.push({
        ...transaction,
        transactionIndex: transactionIndex,
        transaction: Transaction.newFromPlainObject({
          ...transaction,
          chainID: chainId
        }),
        needsSigning: true
      });
    }
  });

  return { allTransactions, txsDataTokens };
}

async function getTxsErrors(
  props: ValidateSignTransactionsType & {
    allTransactions: MultiSignTransactionType[];
    txsDataTokens: Record<string, TransactionDataTokenType>;
  }
) {
  const {
    address,
    egldLabel,
    balance,
    chainId,
    apiConfig,
    allTransactions,
    txsDataTokens
  } = props;
  let allErrors: { [key: string]: string } = {};
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

  return allErrors;
}

export async function validateSignTransactions(
  props: ValidateSignTransactionsType
) {
  const { extractedTxs } = props;

  if (extractedTxs && extractedTxs.length > 0) {
    const { allTransactions, txsDataTokens } = extractAllTransactions(props);

    const allErrors = await getTxsErrors({
      ...props,
      allTransactions,
      txsDataTokens
    });

    return {
      txsDataTokens,
      errors: allErrors,
      parsedTransactions: allTransactions
    };
  }

  return null;
}
