import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@elrondnetwork/dapp-core/constants/index';
import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import BigNumber from 'bignumber.js';
import { parseAmount } from 'helpers';

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
  const nominatedAmount = parseAmount(amount.toString());
  const bnAmount = new BigNumber(nominatedAmount);
  const bnBalance = new BigNumber(balance);
  const fee = new BigNumber(
    calculateFeeLimit({
      gasPrice: parseAmount(gasPrice),
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(GAS_PER_DATA_BYTE),
      gasPriceModifier: String(GAS_PRICE_MODIFIER)
    })
  );

  const valid = bnBalance.isGreaterThanOrEqualTo(bnAmount.plus(fee));

  return valid;
}
export default validateGasLimitAmount;
