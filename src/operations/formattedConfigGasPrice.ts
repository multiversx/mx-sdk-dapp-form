import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { GAS_PRICE } from '@multiversx/sdk-dapp/out/constants';
import BigNumber from 'bignumber.js';

export const formattedConfigGasPrice = formatAmount({
  input: String(GAS_PRICE ?? 1_000_000_000),
  decimals: DECIMALS ?? 18,
  showLastNonZeroDecimal: true,
  digits: DIGITS ?? 4
});

export const maxAcceptedGasPrice = new BigNumber(formattedConfigGasPrice)
  .times(10)
  .toString(10);
