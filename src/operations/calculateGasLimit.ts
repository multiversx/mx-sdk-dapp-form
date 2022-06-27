import * as constants from '@elrondnetwork/dapp-core/constants';
import BigNumber from 'bignumber.js';

interface CalculateGasLimitType {
  data: string;
}

export function calculateGasLimit({ data }: CalculateGasLimitType) {
  const bNconfigGasLimit = new BigNumber(constants.gasLimit);
  const bNgasPerDataByte = new BigNumber(constants.gasPerDataByte);
  const bNgasValue = data
    ? bNgasPerDataByte.times(Buffer.from(data).length)
    : 0;
  const bNgasLimit = bNconfigGasLimit.plus(bNgasValue);
  const gasLimit = bNgasLimit.toString(10);
  return gasLimit;
}

export default calculateGasLimit;
