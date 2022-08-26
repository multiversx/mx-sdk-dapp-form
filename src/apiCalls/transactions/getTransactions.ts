import { ServerTransactionType } from '@elrondnetwork/dapp-core/types/serverTransactions.types';
import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';

export interface GetTransactionsType {
  address: string;
  page?: number;
  transactionSize?: number;
  after?: number;
  before?: number;
}

export async function getTransactions({
  address,
  page = 1,
  transactionSize = 15,
  after,
  before
}: GetTransactionsType) {
  const apiConfig = await getApiConfig();
  return axios.get<ServerTransactionType[]>('/transactions', {
    params: {
      sender: address,
      receiver: address,
      condition: 'should',
      after,
      before,
      from: (page - 1) * transactionSize,
      ...(transactionSize > 0 ? { size: transactionSize } : {})
    },
    ...apiConfig
  });
}
