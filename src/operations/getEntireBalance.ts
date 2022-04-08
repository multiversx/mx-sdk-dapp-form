import { denominate, calculateFeeLimit } from '@elrondnetwork/dapp-core';
import BigNumber from 'bignumber.js';
import { gasPerDataByte, gasPriceModifier, minDust } from 'constants/index';

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
  balance = '0',
  gasLimit = '0',
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

  const entireBalance =
    // entireBalance >= 0
    bNentireBalance.comparedTo(0) === 1
      ? denominate({
          input: bNentireBalance.toString(10),
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
          addCommas: false
        })
      : '0';

  const entireBalanceMinusDust =
    // entireBalanceMinusDust >= 0
    bNentireBalanceMinusDust.comparedTo(0) === 1
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
      : '0'
  };
}

export function getEntireTokenBalance({
  balance = '0',
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
  return '0';
}
export default getEntireBalance;
