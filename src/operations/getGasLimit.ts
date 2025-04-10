import BigNumber from 'bignumber.js';
import { TOKEN_GAS_LIMIT } from 'constants/index';
import { TransactionTypeEnum } from 'types/enums';
import { addDespositGasLimit } from './addDepositGatLimit';
import { calculateGasLimit } from './calculateGasLimit';
import { calculateNftGasLimit } from './calculateNftGasLimit';
import { getGuardedAccountGasLimit } from './getGuardedAccountGasLimit';

export interface GetGasLimitType {
  txType: TransactionTypeEnum;
  data?: string;
  isGuarded?: boolean;
  isDeposit?: boolean;
}

export function getGasLimit({
  txType,
  data = '',
  isGuarded,
  isDeposit
}: GetGasLimitType) {
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

  const numericGasLimit = new BigNumber(gasLimit).toString(10);
  gasLimit = addDespositGasLimit({ gasLimit: numericGasLimit, isDeposit });

  const finalGasLimit = new BigNumber(gasLimit)
    .plus(guardedAccountGasLimit)
    .toString(10);

  return finalGasLimit;
}
