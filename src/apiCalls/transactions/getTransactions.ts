import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';
import { TransactionType } from 'types';

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
  return axios.get<TransactionType[]>('/transactions', {
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
