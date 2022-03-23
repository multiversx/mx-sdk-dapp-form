import { denominate } from '@elrondnetwork/dapp-core';
import { gasPrice as configGasPrice, denomination, decimals } from 'config';

export const denominatedConfigGasPrice = denominate({
  input: configGasPrice,
  denomination,
  showLastNonZeroDecimal: true,
  decimals
});

export default denominatedConfigGasPrice;
