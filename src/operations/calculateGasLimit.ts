import {
  gasLimit,
  gasPerDataByte
} from '@elrondnetwork/dapp-core/constants/index';
import BigNumber from 'bignumber.js';

interface CalculateGasLimitType {
  data: string;
}

export function calculateGasLimit({ data }: CalculateGasLimitType) {
  const bNconfigGasLimit = new BigNumber(gasLimit);
  const bNgasPerDataByte = new BigNumber(gasPerDataByte);
  const bNgasValue = data
    ? bNgasPerDataByte.times(Buffer.from(data).length)
    : 0;
  const bNgasLimit = bNconfigGasLimit.plus(bNgasValue);
  return bNgasLimit.toString(10);
}

export default calculateGasLimit;
