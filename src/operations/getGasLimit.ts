import BigNumber from 'bignumber.js';
import { TOKEN_GAS_LIMIT } from 'constants/index';
import { TransactionTypeEnum } from 'types/enums';
import { calculateGasLimit } from './calculateGasLimit';
import { calculateNftGasLimit } from './calculateNftGasLimit';
import { getGuardedAccountGasLimit } from './getGuardedAccountGasLimit';

export interface GetGasLimitType {
  txType: TransactionTypeEnum;
  data?: string;
  isGuarded?: boolean;
}
export function getGasLimit({ txType, data = '', isGuarded }: GetGasLimitType) {
  const guardedAccountGasLimit = getGuardedAccountGasLimit(isGuarded);

  let gasLimit = calculateNftGasLimit();

  if (txType === TransactionTypeEnum.ESDT) {
    gasLimit = TOKEN_GAS_LIMIT;
  }

  if (txType === TransactionTypeEnum.EGLD) {
    gasLimit = calculateGasLimit({
      data: data.trim()
    });
  }

  return new BigNumber(gasLimit).plus(guardedAccountGasLimit).toString(10);
}
