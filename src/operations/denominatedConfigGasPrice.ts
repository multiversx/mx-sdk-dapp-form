import {
  decimals,
  denomination,
  gasPrice
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils';

export const denominatedConfigGasPrice = denominate({
  input: String(gasPrice),
  denomination: denomination,
  showLastNonZeroDecimal: true,
  decimals: decimals
});

export default denominatedConfigGasPrice;
