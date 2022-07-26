import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';
import { ExtendedValuesType } from 'types';

export function showMax({
  amount = '',
  available,
  readonly = false,
  entireBalanceMinusDust
}: {
  amount: string | undefined;
  available: string;
  entireBalanceMinusDust: string;
  readonly?: ExtendedValuesType['readonly'];
}) {
  const bNamount = new BigNumber(amount);
  const bNentireBalanceMinusDust = new BigNumber(entireBalanceMinusDust);
  const amountSmallerThanAvailable =
    bNentireBalanceMinusDust.comparedTo(bNamount) === 1;
  const valueIsUndefined = !amount;
  return (
    (valueIsUndefined || amountSmallerThanAvailable) &&
    available !== ZERO &&
    !readonly
  );
}
export default showMax;
