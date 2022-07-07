import {
  decimals,
  denomination,
  gasPrice as defaultGasPrice
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

export function getInitialGasPrice(gasPrice = String(defaultGasPrice)) {
  return gasPrice !== '0'
    ? gasPrice
    : denominate({
        input: String(gasPrice),
        denomination: denomination,
        showLastNonZeroDecimal: true,
        decimals: decimals
      });
}

export default getInitialGasPrice;
