import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';
import { getIsDisabled } from 'helpers';
import { ExtendedValuesType, ValuesEnum } from 'types';

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
    bNentireBalanceMinusDust.isGreaterThan(bNamount);
  const valueIsUndefined = !amount;

  const isDisabled = getIsDisabled(ValuesEnum.amount, readonly);

  return (
    (valueIsUndefined || amountSmallerThanAvailable) &&
    available !== ZERO &&
    !isDisabled
  );
}
export default showMax;
