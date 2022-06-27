import * as constants from '@elrondnetwork/dapp-core/constants';
import { denominate } from '@elrondnetwork/dapp-core/utils';

export function getInitialGasPrice(gasPrice: string) {
  const initialGasPrice =
    gasPrice !== '0'
      ? gasPrice
      : denominate({
          input: String(constants.gasPrice),
          denomination: constants.denomination,
          showLastNonZeroDecimal: true,
          decimals: constants.decimals
        });
  return initialGasPrice;
}

export default getInitialGasPrice;
