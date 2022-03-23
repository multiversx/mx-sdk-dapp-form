import { operations } from '@elrondnetwork/dapp-utils';
import { gasPerDataByte, gasPriceModifier } from 'constants/index';

interface CalculateFeeLimitType {
  gasLimit: string;
  gasPrice: string;
  data: string;
  chainId: string;
}

export const calculateFeeLimit = (props: CalculateFeeLimitType) => {
  return operations.calculateFeeLimit({
    ...props,
    gasPerDataByte: String(gasPerDataByte),
    gasPriceModifier: String(gasPriceModifier)
  });
};

export default calculateFeeLimit;
