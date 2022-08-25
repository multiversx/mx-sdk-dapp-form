import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@elrondnetwork/dapp-core/constants/index';
import { formatAmount } from 'helpers';

export const denominatedConfigGasPrice = formatAmount({
  input: String(GAS_PRICE),
  decimals: DECIMALS,
  showLastNonZeroDecimal: true,
  digits: DIGITS
});

export default denominatedConfigGasPrice;
