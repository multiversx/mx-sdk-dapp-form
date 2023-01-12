import {
  MultiEsdtTransactionType,
  MultiSignTransactionType,
  TransactionsDataTokensType
} from '@multiversx/sdk-dapp/types/transactions.types';
import { ApiConfigType } from 'apiCalls';
import { ExtendedValuesType } from 'types';

export type SignTxType = {
  nonce?: string;
  data: any;
  token?: string;
  gasLimit?: string;
  gasPrice?: string;
  receiver?: string;
  value?: string;
  version?: string;
};

export interface TxSignValuesType {
  receiver: string;
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
  extractedTxs: SignTxType[];
  address: string;
  egldLabel: string;
  balance: string;
  chainId: string;
  apiConfig: ApiConfigType;
}
