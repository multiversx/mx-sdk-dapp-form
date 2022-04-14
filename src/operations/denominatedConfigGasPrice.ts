import { denominate, constants } from '@elrondnetwork/dapp-core';

export const denominatedConfigGasPrice = denominate({
  input: String(constants.gasPrice),
  denomination: constants.denomination,
  showLastNonZeroDecimal: true,
  decimals: constants.decimals
});

export default denominatedConfigGasPrice;
