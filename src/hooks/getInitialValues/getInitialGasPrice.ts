import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { GAS_PRICE } from '@multiversx/sdk-dapp/out/constants';
import { ZERO } from 'constants/index';

export const getInitialGasPrice = (gasPrice?: string) => {
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
};
