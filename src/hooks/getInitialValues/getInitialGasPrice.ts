import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@multiversx/sdk-dapp/constants/index';

import { ZERO } from 'constants/index';
import { formatAmount } from 'helpers';

export function getInitialGasPrice(gasPrice?: string) {
  const isGasPriceValid = gasPrice != null && gasPrice !== ZERO;
  const gasPriceValue = isGasPriceValid
    ? gasPrice
    : formatAmount({
        input: String(GAS_PRICE),
        decimals: DECIMALS,
        showLastNonZeroDecimal: true,
        digits: DIGITS
      });

  return gasPriceValue;
}

export default getInitialGasPrice;
