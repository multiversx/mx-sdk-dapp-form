import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@multiversx/sdk-dapp/out/constants';
import { calculateFeeLimit } from '@multiversx/sdk-dapp/out/providers/strategies/helpers/signTransactions/helpers/calculateFeeLimit';
import BigNumber from 'bignumber.js';
import { parseAmount } from 'helpers';
import { getParsedGasPrice } from 'operations';

interface ValidateGasLimitAmountType {
  amount: string;
  balance: string;
  gasPrice: string;
  gasLimit: string;
  data: string;
  chainId: string;
}

export const validateGasLimitAmount = ({
  amount,
  balance,
  gasPrice,
  gasLimit,
  data,
  chainId
}: ValidateGasLimitAmountType): boolean => {
  const parsedAmount = parseAmount(amount.toString());
  const bnAmount = new BigNumber(parsedAmount);

  const bnBalance = new BigNumber(balance);

  const fee = new BigNumber(
    calculateFeeLimit({
      gasPrice: getParsedGasPrice(gasPrice),
      gasLimit,
      data,
      chainId,
      gasPerDataByte: String(GAS_PER_DATA_BYTE),
      gasPriceModifier: String(GAS_PRICE_MODIFIER)
    })
  );

  const valid = bnBalance.isGreaterThanOrEqualTo(bnAmount.plus(fee));

  return valid;
};
