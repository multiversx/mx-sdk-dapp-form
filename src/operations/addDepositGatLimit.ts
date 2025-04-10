import BigNumber from 'bignumber.js';
import { DEPOSIT_GAS_LIMIT } from 'constants/index';

interface IAddDepositGasLimitParams {
  gasLimit: string | number;
  isDeposit?: boolean;
}

export const addDespositGasLimit = ({
  gasLimit,
  isDeposit
}: IAddDepositGasLimitParams): string => {
  if (!isDeposit) {
    return gasLimit.toString();
  }

  return new BigNumber(gasLimit).plus(DEPOSIT_GAS_LIMIT).toString(10);
};
