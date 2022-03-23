import { nominate } from '@elrondnetwork/dapp-core';
import { operations } from '@elrondnetwork/dapp-utils';
import BigNumber from 'bignumber.js';
import { gasPerDataByte, gasPriceModifier } from 'constants/index';

interface ValidateGasLimitAmountType {
  amount: string;
  balance: string;
  gasPrice: string;
  gasLimit: string;
  data: string;
  chainId: string;
  gasLimitContext?: boolean;
}

export function validateGasLimitAmount({
  amount,
  balance,
  gasPrice,
  gasLimit,
  data,
  chainId,
  gasLimitContext = false
}: ValidateGasLimitAmountType) {
  const nominatedAmount = nominate(amount.toString());
  const bnAmount = new BigNumber(nominatedAmount);
  const bnBalance = new BigNumber(balance);
  const fee = new BigNumber(
    // TODO: maybe keep here
    operations.calculateFeeLimit({
      gasPrice: nominate(gasPrice),
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(gasPerDataByte),
      gasPriceModifier: String(gasPriceModifier)
    })
  );

  const valid = bnBalance.isGreaterThanOrEqualTo(bnAmount.plus(fee));

  const gasLimitValidation = gasLimitContext
    ? !bnAmount.isZero()
    : bnAmount.isZero();
  const result = valid ? valid : gasLimitValidation;
  return result;
}
export default validateGasLimitAmount;
