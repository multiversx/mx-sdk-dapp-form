import {
  gasPerDataByte,
  gasPriceModifier
} from '@elrondnetwork/dapp-core/constants/index';
import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';

import BigNumber from 'bignumber.js';
import { minDust, ZERO } from 'constants/index';

interface EntireBalanceType {
  balance?: string;
  gasPrice: string;
  gasLimit?: string;
  denomination: number;
  decimals: number;
  data?: string;
  chainId: string;
}

export function getEntireBalance({
  balance = ZERO,
  gasLimit = ZERO,
  gasPrice,
  denomination,
  decimals,
  data = '',
  chainId
}: EntireBalanceType) {
  const bnBalance = new BigNumber(balance);
  const bnMinDust = new BigNumber(minDust);

  const fee = new BigNumber(
    calculateFeeLimit({
      gasPrice,
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(gasPerDataByte),
      gasPriceModifier: String(gasPriceModifier)
    })
  );

  const bNentireBalance = bnBalance.minus(fee);
  const bNentireBalanceMinusDust = bNentireBalance.minus(bnMinDust);

  const entireBalance = bNentireBalance.isGreaterThanOrEqualTo(0)
    ? denominate({
        input: bNentireBalance.toString(10),
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    : ZERO;

  const entireBalanceMinusDust = bNentireBalanceMinusDust.isGreaterThanOrEqualTo(
    0
  )
    ? denominate({
        input: bNentireBalanceMinusDust.toString(10),
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    : entireBalance;

  return {
    entireBalance,
    entireBalanceMinusDust,
    nominatedEntireBalance: bNentireBalance.isGreaterThan(0)
      ? bNentireBalance.toString(10)
      : ZERO
  };
}

export function getEntireTokenBalance({
  balance = ZERO,
  denomination = 18,
  decimals = 4
}) {
  const bnBalance = new BigNumber(balance);
  // entireBalance >= 0
  if (bnBalance.comparedTo(0) === 1) {
    const input = bnBalance.toString(10);
    return denominate({
      input,
      denomination,
      decimals,
      showLastNonZeroDecimal: true,
      addCommas: false
    });
  }
  return ZERO;
}
export default getEntireBalance;
