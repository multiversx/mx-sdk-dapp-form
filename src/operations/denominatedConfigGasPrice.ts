import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from 'helpers';

export const denominatedConfigGasPrice = denominate({
  input: String(GAS_PRICE),
  decimals: DECIMALS,
  showLastNonZeroDecimal: true,
  digits: DIGITS
});

export default denominatedConfigGasPrice;
