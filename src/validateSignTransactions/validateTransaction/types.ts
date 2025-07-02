import { IPlainTransactionObject } from '@multiversx/sdk-core/out';
import {
  MultiEsdtTransactionType,
  MultiSignTransactionType,
  TransactionsDataTokensType
} from '@multiversx/sdk-dapp/out/types/transactions.types';
import { ApiConfigType } from 'apiCalls';
import { ExtendedValuesType } from 'types';

export interface TxSignValuesType {
  receiver: string;
  receiverUsername?: string;
  senderUsername?: string;
  amount: string;
  tokenId: string;
  gasLimit: string;
  gasPrice: string;
  data: string;
  nonce?: string;
}

export interface ValidateType {
  tx: MultiSignTransactionType;
  txsDataTokens: TransactionsDataTokensType;
  type?: MultiEsdtTransactionType['type'];
  ledger?: ExtendedValuesType['ledger'];
  egldLabel: string;
  address: string;
  balance: string;
  chainId: string;
  apiConfig: ApiConfigType;
}

export interface ValidateSignTransactionsType {
  extractedTxs: IPlainTransactionObject[];
  address: string;
  egldLabel: string;
  balance: string;
  chainId: string;
  apiConfig: ApiConfigType;
}
