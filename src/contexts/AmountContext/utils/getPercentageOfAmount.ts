import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';

export const getPercentageOfAmount = (
  amount: string,
  maxAmountMinusDust: string
) => {
  const value = stringIsFloat(String(amount)) ? amount : ZERO;
  const maxBalanceBn = stringIsFloat(String(maxAmountMinusDust))
    ? new BigNumber(maxAmountMinusDust)
    : new BigNumber(ZERO);

  const percentage = BigNumber(100)
    .dividedBy(maxBalanceBn.dividedBy(value))
    .toNumber();

  return BigNumber.minimum(percentage, 100).toNumber();
};
