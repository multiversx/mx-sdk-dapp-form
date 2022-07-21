import {
  decimals,
  denomination,
  gasPrice as defaultGasPrice
} from '@elrondnetwork/dapp-core/esm/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

export function getInitialGasPrice(gasPrice?: string) {
  const isGasPriceValid = gasPrice != null && gasPrice !== '0';
  const gasPriceValue = isGasPriceValid
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
