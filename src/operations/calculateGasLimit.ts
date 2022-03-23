import BigNumber from 'bignumber.js';
import { gasLimit as configGasLimit, gasPerDataByte } from 'constants/index';

interface CalculateGasLimitType {
  data: string;
}

export function calculateGasLimit({ data }: CalculateGasLimitType) {
  const bNconfigGasLimit = new BigNumber(configGasLimit);
  const bNgasPerDataByte = new BigNumber(gasPerDataByte);
  const bNgasValue = data
    ? bNgasPerDataByte.times(Buffer.from(data).length)
    : 0;
  const bNgasLimit = bNconfigGasLimit.plus(bNgasValue);
  const gasLimit = bNgasLimit.toString(10);
  return gasLimit;
}

export default calculateGasLimit;
