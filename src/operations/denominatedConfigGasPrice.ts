import * as constants from '@elrondnetwork/dapp-core/constants';
import { denominate } from '@elrondnetwork/dapp-core/utils';

export const denominatedConfigGasPrice = denominate({
  input: String(constants.gasPrice),
  denomination: constants.denomination,
  showLastNonZeroDecimal: true,
  decimals: constants.decimals
});

export default denominatedConfigGasPrice;
