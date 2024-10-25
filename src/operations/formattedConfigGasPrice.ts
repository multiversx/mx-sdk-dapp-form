import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';
import { formatAmount } from 'helpers';

export const formattedConfigGasPrice = formatAmount({
  input: String(GAS_PRICE ?? 1_000_000_000),
  decimals: DECIMALS ?? 18,
  showLastNonZeroDecimal: true,
  digits: DIGITS ?? 4
});

export const maxAcceptedGasPrice = new BigNumber(formattedConfigGasPrice)
  .times(10)
  .toString(10);
