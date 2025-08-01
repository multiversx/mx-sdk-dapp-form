import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@multiversx/sdk-dapp/out/constants';
import { calculateFeeLimit } from '@multiversx/sdk-dapp/out/providers/strategies/helpers/signTransactions/helpers/calculateFeeLimit';
import BigNumber from 'bignumber.js';
import { MIN_DUST, ZERO } from 'constants/index';

interface EntireBalanceType {
  balance?: string;
  gasPrice: string;
  gasLimit?: string;
  decimals: number;
  digits: number;
  data?: string;
  chainId: string;
}

export function getEntireBalance({
  balance = ZERO,
  gasLimit = ZERO,
  gasPrice,
  decimals,
  digits,
  data = '',
  chainId
}: EntireBalanceType) {
  const bnBalance = new BigNumber(balance);
  const bnMinDust = new BigNumber(MIN_DUST);

  const fee = new BigNumber(
    calculateFeeLimit({
      gasPrice,
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(GAS_PER_DATA_BYTE),
      gasPriceModifier: String(GAS_PRICE_MODIFIER)
    })
  );

  const bNentireBalance = bnBalance.minus(fee);
  const bNentireBalanceMinusDust = bNentireBalance.minus(bnMinDust);

  const entireBalance = bNentireBalance.isGreaterThanOrEqualTo(0)
    ? formatAmount({
        input: bNentireBalance.toString(10),
        decimals,
        digits,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    : ZERO;

  const entireBalanceMinusDust =
    bNentireBalanceMinusDust.isGreaterThanOrEqualTo(0)
      ? formatAmount({
          input: bNentireBalanceMinusDust.toString(10),
          decimals,
          digits,
          showLastNonZeroDecimal: true,
          addCommas: false
        })
      : entireBalance;

  return {
    entireBalance,
    entireBalanceMinusDust,
    parsedEntireBalance: bNentireBalance.isGreaterThan(0)
      ? bNentireBalance.toString(10)
      : ZERO
  };
}

export function getEntireTokenBalance({
  balance = ZERO,
  decimals = DECIMALS,
  digits = DIGITS
}) {
  const bnBalance = new BigNumber(balance);
  // entireBalance >= 0
  if (bnBalance.isGreaterThanOrEqualTo(0)) {
    const input = bnBalance.toString(10);

    return formatAmount({
      input,
      decimals,
      digits: digits > decimals ? decimals : digits,
      showLastNonZeroDecimal: true,
      addCommas: false
    });
  }

  return ZERO;
}
export default getEntireBalance;
