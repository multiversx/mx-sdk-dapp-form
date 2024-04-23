import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@multiversx/sdk-dapp/constants/index';
import { formatAmount } from 'helpers';

export const formattedConfigGasPrice = formatAmount({
  input: String(GAS_PRICE ?? 1_000_000_000),
  decimals: DECIMALS,
  showLastNonZeroDecimal: true,
  digits: DIGITS
});
