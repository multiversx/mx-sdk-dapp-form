import {
  GAS_LIMIT,
  GAS_PER_DATA_BYTE
} from '@multiversx/sdk-dapp/out/constants/mvx.constants';
import BigNumber from 'bignumber.js';
import { byteLength } from 'helpers/transformations';
import { addDespositGasLimit } from './addDepositGatLimit';
import { getGuardedAccountGasLimit } from './getGuardedAccountGasLimit';

interface CalculateGasLimitType {
  data: string;
  isGuarded?: boolean;
  isDeposit?: boolean;
}

export const calculateGasLimit = ({
  data,
  isGuarded,
  isDeposit
}: CalculateGasLimitType) => {
  const bNconfigGasLimit = new BigNumber(GAS_LIMIT);
  const bNgasPerDataByte = new BigNumber(GAS_PER_DATA_BYTE);
  const bNgasValue = data ? bNgasPerDataByte.times(byteLength(data)) : 0;
  const guardedAccountGasLimit = getGuardedAccountGasLimit(isGuarded);
  const bNgasLimit = bNconfigGasLimit
    .plus(bNgasValue)
    .plus(guardedAccountGasLimit);

  return addDespositGasLimit({ gasLimit: bNgasLimit.toString(10), isDeposit });
};
