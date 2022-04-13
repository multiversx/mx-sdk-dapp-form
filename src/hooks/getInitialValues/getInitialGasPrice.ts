import { denominate, constants } from '@elrondnetwork/dapp-core';

export function getInitialGasPrice(gasPrice: string) {
  const initialGasPrice =
    gasPrice !== '0'
      ? gasPrice
      : denominate({
          input: String(constants.defaultGasPrice),
          denomination: constants.denomination,
          showLastNonZeroDecimal: true,
          decimals: constants.decimals
        });
  return initialGasPrice;
}

export default getInitialGasPrice;
