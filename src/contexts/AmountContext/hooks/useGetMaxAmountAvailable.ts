import { DIGITS, DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants';
import { useFormikContext } from 'formik';
import { ZERO } from 'constants/index';
import { useAccountContext } from 'contexts/AccountContext';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import {
  getEntireBalance,
  getEntireTokenBalance,
  getParsedGasPrice,
  getTokenDetails
} from 'operations';

import { ExtendedValuesType, NftEnumType } from 'types';
import { useFormContext } from '../../FormContext';
import { useGasContext } from '../../GasContext';
import { useTokensContext } from '../../TokensContext';

interface UseGetMaxAmountAvailableReturnType {
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
}

export function useGetMaxAmountAvailable(): UseGetMaxAmountAvailableReturnType {
  const { values } = useFormikContext<ExtendedValuesType>();
  const { balance } = useAccountContext();
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const { nft, tokens } = useTokensContext();
  const { isEsdtTransaction, isNftTransaction, isEgldTransaction } =
    useFormContext();

  const { gasLimit, gasPrice } = useGasContext();
  const { tokenId } = values;

  let nftBalance = null;

  if (isNftTransaction && nft) {
    const computedNftBalance = getEntireTokenBalance({
      balance: nft.balance,
      decimals: nft.type === NftEnumType.MetaESDT ? nft.decimals : 0,
      digits: DIGITS
    });
    nftBalance = computedNftBalance;
  }

  let tokenBalance = null;

  if (isEsdtTransaction) {
    const { decimals, balance: newTokenBalance } = getTokenDetails({
      tokens,
      tokenId
    });

    const tokenAmount = getEntireTokenBalance({
      balance: newTokenBalance,
      decimals,
      digits: DIGITS
    });

    tokenBalance = tokenAmount;
  }

  let formattedEgldBalance = ZERO;
  let balanceMinusDust = balance;

  if (balance && isEgldTransaction) {
    const { entireBalance: formattedBalance, entireBalanceMinusDust } =
      getEntireBalance({
        balance,
        gasPrice: getParsedGasPrice(gasPrice),
        gasLimit: gasLimit,
        decimals: DECIMALS,
        digits: DIGITS,
        chainId
      });

    formattedEgldBalance = formattedBalance;
    balanceMinusDust = entireBalanceMinusDust;
  }

  const esdtAmountAvailable = nft && nftBalance ? nftBalance : tokenBalance;

  const maxAmountAvailable = isEgldTransaction
    ? formattedEgldBalance
    : esdtAmountAvailable;

  const maxAmountMinusDust = isEgldTransaction
    ? balanceMinusDust
    : maxAmountAvailable;

  return {
    maxAmountAvailable: maxAmountAvailable || ZERO,
    maxAmountMinusDust: maxAmountMinusDust || ZERO
  };
}
