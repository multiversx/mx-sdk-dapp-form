import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';
import { getTransactionCost } from 'apiCalls/transactions';
import { gasLimitDelta, ZERO } from 'constants/index';
import calculateGasLimit from 'operations/calculateGasLimit';
import { ValuesType } from 'types';
import { prepareTransaction } from './prepareTransaction';

export interface FetchGasLimitType {
  balance: string;
  address: string;
  nonce: number;
  values: Omit<ValuesType, 'tokenId'>;
  chainId: string;
}

export const fetchGasLimit = async ({
  balance,
  address,
  nonce,
  values,
  chainId
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

  const { data: responseData, success } = await getTransactionCost({
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
    String(txGasUnits) === ZERO ? calculatedGasLimit : String(txGasUnits);

  return { gasLimit: newGasLimit };
};

export default fetchGasLimit;
