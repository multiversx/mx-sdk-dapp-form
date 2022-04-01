import { denominate } from '@elrondnetwork/dapp-core';
import {
  denomination,
  decimals,
  defaultGasPrice as configGasPrice
} from 'constants/index';

export function getInitialGasPrice(gasPrice: string) {
  const initialGasPrice =
    gasPrice !== '0'
      ? gasPrice
      : denominate({
          input: String(configGasPrice),
          denomination,
          showLastNonZeroDecimal: true,
          decimals
        });
  return initialGasPrice;
}

export default getInitialGasPrice;
