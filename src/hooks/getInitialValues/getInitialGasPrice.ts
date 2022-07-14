import {
  decimals,
  denomination,
  gasPrice as defaultGasPrice
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

export function getInitialGasPrice(gasPrice = '0') {
  const gasPriceValue =
    gasPrice !== '0'
      ? gasPrice
      : denominate({
          input: String(defaultGasPrice),
          denomination: denomination,
          showLastNonZeroDecimal: true,
          decimals: decimals
        });

  return gasPriceValue;
}

export default getInitialGasPrice;
