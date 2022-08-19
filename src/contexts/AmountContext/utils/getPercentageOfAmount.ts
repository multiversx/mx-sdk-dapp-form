import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';

export const getPercentageOfAmount = (
  amount: string,
  maxAmountMinusDust: string
) => {
  const isAmountValid = !isNaN(amount as any) && stringIsFloat(String(amount));
  const value = isAmountValid ? amount : ZERO;

  const denominatedBN = stringIsFloat(String(maxAmountMinusDust))
    ? new BigNumber(String(maxAmountMinusDust).replace('.', ''))
    : new BigNumber(ZERO);
  const nominatedBN = new BigNumber(nominate(value));
  const percentage = 100 / Number(String(denominatedBN.dividedBy(nominatedBN)));

  return Math.round(percentage);
};
