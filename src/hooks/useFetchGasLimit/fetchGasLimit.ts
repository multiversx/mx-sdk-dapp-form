import { nominate } from '@elrondnetwork/dapp-core';
import BigNumber from 'bignumber.js';
import { getTransactionCost } from 'apiCalls/transactions';
import { ApiPropsType } from 'apiCalls/types';
import { gasLimitDelta } from 'constants/index';
import calculateGasLimit from 'operations/calculateGasLimit';
import { ValuesType } from 'types';
import { prepareTransaction } from './prepareTransaction';

export interface FetchGasLimitType {
  balance: string;
  address: string;
  nonce: number;
  values: Omit<ValuesType, 'tokenId'>;
  chainId: string;
  apiProps: ApiPropsType;
}

export const fetchGasLimit = async ({
  balance,
  address,
  nonce,
  values,
  chainId,
  apiProps
}: FetchGasLimitType): Promise<{
  gasLimit: string;
  gasLimitCostError?: string;
}> => {
  const { amount, receiver, data, gasLimit, gasPrice } = values;

  const transaction = prepareTransaction({
    balance,
    amount: String(amount),
    gasLimit: String(gasLimit),
    gasPrice: nominate(gasPrice),
    data: data.trim(),
    receiver,
    nonce,
    chainId
  });
  const plainTransaction = transaction.toPlainObject();

  const getData = getTransactionCost(apiProps);
  const { data: responseData, success } = await getData({
    ...plainTransaction,
    sender: address
  });

  const txGasUnits = Number(responseData?.data?.txGasUnits);
  const returnMessage = responseData?.data?.returnMessage;

  const validTxGasUnits = Boolean(
    success &&
      responseData?.code === 'successful' &&
      txGasUnits &&
      txGasUnits !== 0
  );

  if (!validTxGasUnits) {
    return {
      gasLimit,
      gasLimitCostError: responseData?.data?.returnMessage
    };
  }

  if (!returnMessage) {
    const bNgasLimitTreshold = new BigNumber(txGasUnits)
      .times(gasLimitDelta)
      .dividedToIntegerBy(100);
    const adjustedGasLimit = bNgasLimitTreshold.plus(txGasUnits).toString(10);
    return { gasLimit: adjustedGasLimit };
  }

  const calculatedGasLimit = calculateGasLimit({
    data: values.data ? values.data.trim() : ''
  });

  const newGasLimit: string =
    String(txGasUnits) === '0' ? calculatedGasLimit : String(txGasUnits);

  return { gasLimit: newGasLimit };
};

export default fetchGasLimit;
