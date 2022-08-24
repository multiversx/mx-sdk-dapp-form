import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@elrondnetwork/dapp-core/constants/index';

import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { ZERO } from 'constants/index';

export function getInitialGasPrice(gasPrice?: string) {
  const isGasPriceValid = gasPrice != null && gasPrice !== ZERO;
  const gasPriceValue = isGasPriceValid
    ? gasPrice
    : denominate({
        input: String(GAS_PRICE),
        denomination: DECIMALS,
        showLastNonZeroDecimal: true,
        decimals: DIGITS
      });

  return gasPriceValue;
}

export default getInitialGasPrice;
