import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';

export const getPercentageOfAmount = (
  amount: string,
  maxAmountMinusDust: string
) => {
  const value = Boolean(amount) ? amount : ZERO;
  const total = new BigNumber(nominate(maxAmountMinusDust));
  const difference = new BigNumber(nominate(value));
  const percentage = 100 / Number(String(total.dividedBy(difference)));

  return Math.round(percentage);
};
