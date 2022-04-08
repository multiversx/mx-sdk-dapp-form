import { calculateFeeLimit as computeFeeLimit } from '@elrondnetwork/dapp-core';
import { gasPerDataByte, gasPriceModifier } from 'constants/index';

interface CalculateFeeLimitType {
  gasLimit: string;
  gasPrice: string;
  data: string;
  chainId: string;
}

export const calculateFeeLimit = (props: CalculateFeeLimitType) => {
  return computeFeeLimit({
    ...props,
    gasPerDataByte: String(gasPerDataByte),
    gasPriceModifier: String(gasPriceModifier)
  });
};

export default calculateFeeLimit;
