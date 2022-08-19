import { newTransaction } from '@elrondnetwork/dapp-core/models/newTransaction';
import {
  MultiEsdtTxType,
  MultiSignTxType,
  TxDataTokenType,
  TxsDataTokensType
} from '@elrondnetwork/dapp-core/types/transactions';

import { getTokenFromData } from '@elrondnetwork/dapp-core/utils/transactions/getTokenFromData';
import { parseMultiEsdtTransferData } from '@elrondnetwork/dapp-core/utils/transactions/parseMultiEsdtTransferData';
import getTxWithReceiver from './getTxWithReceiver';
import {
  SignTxType,
  ValidateSignTransactionsType,
  validateTransaction
} from './validateTransaction';

function processMultiTx(props: {
  trx: MultiEsdtTxType;
  transaction: SignTxType;
  transactionIndex: number;
}) {
  const { transaction, transactionIndex, trx } = props;
  const newTx: MultiSignTxType = {
    ...transaction,
    transaction: newTransaction(trx),
    multiTxData: trx.data,
    transactionIndex
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
  let txsDataTokens: TxsDataTokensType = {};
  const allTransactions: MultiSignTxType[] = [];

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
      if (tokenId) {
        txsDataTokens = {
          ...txsDataTokens,
          [transaction.data]: { tokenId, amount }
        };
      }
      allTransactions.push({
        ...transaction,
        transactionIndex: transactionIndex,
        transaction: newTransaction({ ...transaction, chainId })
      });
    }
  });
  return { allTransactions, txsDataTokens };
}

async function getTxsErrors(
  props: ValidateSignTransactionsType & {
    allTransactions: MultiSignTxType[];
    txsDataTokens: Record<string, TxDataTokenType>;
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
