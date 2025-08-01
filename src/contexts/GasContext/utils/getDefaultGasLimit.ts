import { GAS_LIMIT } from '@multiversx/sdk-dapp/out/constants';
import BigNumber from 'bignumber.js';
import { TOKEN_GAS_LIMIT } from 'constants/index';
import { calculateNftGasLimit, getGuardedAccountGasLimit } from 'operations';

export const getDefaultGasLimit = ({
  isNftTransaction,
  isEsdtTransaction,
  data,
  isGuarded
}: {
  isNftTransaction: boolean;
  isEsdtTransaction: boolean;
  data?: string;
  isGuarded?: boolean;
}): string => {
  const guardedAccountGasLimit = getGuardedAccountGasLimit(isGuarded);

  let gasLimit = GAS_LIMIT.toString();

  if (isNftTransaction) {
    gasLimit = calculateNftGasLimit(data);
  }

  if (isEsdtTransaction) {
    gasLimit = TOKEN_GAS_LIMIT;
  }

  return new BigNumber(gasLimit).plus(guardedAccountGasLimit).toString(10);
};
