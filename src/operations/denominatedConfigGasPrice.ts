import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

export const denominatedConfigGasPrice = denominate({
  input: String(GAS_PRICE),
  denomination: DECIMALS,
  showLastNonZeroDecimal: true,
  decimals: DIGITS
});

export default denominatedConfigGasPrice;
