import {
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@multiversx/sdk-dapp/constants/index';
import { calculateFeeLimit } from '@multiversx/sdk-dapp/utils/operations/calculateFeeLimit';
import BigNumber from 'bignumber.js';
import { getMultiversxAccount } from 'apiCalls/account/getAccount';
import { getApiAddressForChainID } from 'apiCalls/network/getApiAddressForChainID';
import { parseAmount } from 'helpers';
import { getParsedGasPrice } from 'operations';

interface ValidateGasLimitAmountType {
  amount: string;
  balance: string;
  gasPrice: string;
  gasLimit: string;
  data: string;
  chainId: string;
  relayer?: string;
}

export const validateGasLimitAmount = async ({
  amount,
  balance,
  gasPrice,
  gasLimit,
  data,
  chainId,
  relayer
}: ValidateGasLimitAmountType): Promise<boolean> => {
  const parsedAmount = parseAmount(amount.toString());
  const bnAmount = new BigNumber(parsedAmount);

  let actualBalance = balance;

  // If relayer is present, fetch relayer account balance
  if (relayer) {
    try {
      const apiAddress = getApiAddressForChainID(chainId);
      const relayerAccount = await getMultiversxAccount(relayer, apiAddress);
      if (relayerAccount?.balance) {
        actualBalance = relayerAccount.balance;
      }
    } catch (e) {
      // silently fall back – validation will be done on sender balance
      console.error(`Error fetching relayer balance for ${relayer}: ${e}`);
    }
  }

  const bnBalance = new BigNumber(actualBalance);

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
