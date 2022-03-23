import { denominate } from '@elrondnetwork/dapp-core';
import {
  defaultGasPrice as configGasPrice,
  denomination,
  decimals
} from 'constants/index';

export const denominatedConfigGasPrice = denominate({
  input: configGasPrice,
  denomination,
  showLastNonZeroDecimal: true,
  decimals
});

export default denominatedConfigGasPrice;
