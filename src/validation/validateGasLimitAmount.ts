import {
  gasPerDataByte,
  gasPriceModifier
} from '@elrondnetwork/dapp-core/constants/index';
import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';

import BigNumber from 'bignumber.js';

interface ValidateGasLimitAmountType {
  amount: string;
  balance: string;
  gasPrice: string;
  gasLimit: string;
  data: string;
  chainId: string;
}

export function validateGasLimitAmount({
  amount,
  balance,
  gasPrice,
  gasLimit,
  data,
  chainId
}: ValidateGasLimitAmountType) {
  const nominatedAmount = nominate(amount.toString());
  const bnAmount = new BigNumber(nominatedAmount);
  const bnBalance = new BigNumber(balance);
  const fee = new BigNumber(
    calculateFeeLimit({
      gasPrice: nominate(gasPrice),
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(gasPerDataByte),
      gasPriceModifier: String(gasPriceModifier)
    })
  );

  const valid = bnBalance.isGreaterThanOrEqualTo(bnAmount.plus(fee));

  return valid;
}
export default validateGasLimitAmount;
