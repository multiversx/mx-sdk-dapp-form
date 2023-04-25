import BigNumber from 'bignumber.js';
import { getTransactionCost } from 'apiCalls/transactions';
import { GAS_LIMIT_DELTA, ZERO } from 'constants/index';
import { parseAmount } from 'helpers';
import calculateGasLimit from 'operations/calculateGasLimit';
import { ValuesType } from 'types';
import { prepareTransaction } from './prepareTransaction';

interface FetchGasLimitType {
  balance: string;
  address: string;
  isGuarded?: boolean;
  nonce: number;
  values: Omit<ValuesType, 'tokenId'>;
  chainId: string;
}

export const fetchGasLimit = async ({
  balance,
  address,
  isGuarded,
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
    gasPrice: parseAmount(gasPrice),
    data: data.trim(),
    receiver,
    sender: address,
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
      .times(GAS_LIMIT_DELTA)
      .dividedToIntegerBy(100);
    const adjustedGasLimit = bNgasLimitTreshold.plus(txGasUnits).toString(10);
    return { gasLimit: adjustedGasLimit };
  }

  const calculatedGasLimit = calculateGasLimit({
    data: values.data ? values.data.trim() : '',
    isGuarded
  });

  const newGasLimit: string =
    String(txGasUnits) === ZERO ? calculatedGasLimit : String(txGasUnits);

  return { gasLimit: newGasLimit };
};

export default fetchGasLimit;
