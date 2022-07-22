import {
  decimals,
  denomination,
  gasPrice as defaultGasPrice
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

export function getInitialGasPrice(gasPrice?: string) {
  const isGasPriceValid = gasPrice != null && gasPrice !== '0';

  const denominatedGasPrice = denominate({
    input: String(defaultGasPrice),
    denomination: denomination,
    showLastNonZeroDecimal: true,
    decimals: decimals
  });

  const gasPriceValue = isGasPriceValid ? gasPrice : denominatedGasPrice;

  return gasPriceValue;
}

export default getInitialGasPrice;
