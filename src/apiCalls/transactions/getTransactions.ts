import axios from 'axios';
import { ApiPropsType } from 'apiCalls/types';
import { TransactionType } from 'types';

export interface GetTransactionsType {
  address: string;
  page?: number;
  transactionSize?: number;
  after?: number;
  before?: number;
}

export const getTransactions =
  ({ baseURL, timeout }: ApiPropsType) =>
  ({
    address,
    page = 1,
    transactionSize = 15,
    after,
    before
  }: GetTransactionsType) => {
    return axios.get<TransactionType[]>('/transactions', {
      baseURL,
      params: {
        sender: address,
        receiver: address,
        condition: 'should',
        after,
        before,
        from: (page - 1) * transactionSize,
        ...(transactionSize > 0 ? { size: transactionSize } : {})
      },
      timeout
    });
  };
