import BigNumber from 'bignumber.js';

export function showMax({
  amount = '',
  available,
  readonly = false,
  entireBalanceMinusDust
}: {
  amount: string | undefined;
  available: string;
  entireBalanceMinusDust: string;
  readonly?: boolean;
}) {
  const bNamount = new BigNumber(amount);
  const bNentireBalanceMinusDust = new BigNumber(entireBalanceMinusDust);
  const amountSmallerThanAvailable =
    bNentireBalanceMinusDust.comparedTo(bNamount) === 1;
  const valueIsUndefined = !amount;
  return (
    (valueIsUndefined || amountSmallerThanAvailable) &&
    available !== '0' &&
    !readonly
  );
}
export default showMax;
