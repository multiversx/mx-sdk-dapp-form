import { denominate, constants } from '@elrondnetwork/dapp-core';

export const denominatedConfigGasPrice = denominate({
  input: String(constants.defaultGasPrice),
  denomination: constants.denomination,
  showLastNonZeroDecimal: true,
  decimals: constants.decimals
});

export default denominatedConfigGasPrice;
