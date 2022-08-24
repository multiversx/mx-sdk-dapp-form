import { DIGITS, DECIMALS } from '@elrondnetwork/dapp-core/constants/index';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { useFormikContext } from 'formik';
import { ZERO } from 'constants/index';
import { useAccountContext } from 'contexts/AccountContext';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import {
  getEntireBalance,
  getEntireTokenBalance,
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
  const {
    isEsdtTransaction,
    isNftTransaction,
    isEgldTransaction
  } = useFormContext();
  const { gasLimit, gasPrice } = useGasContext();
  const { tokenId } = values;

  let nftBalance = null;
  if (isNftTransaction && nft) {
    const computedNftBalance = getEntireTokenBalance({
      balance: nft.balance,
      denomination: nft.type === NftEnumType.MetaESDT ? nft.decimals : 0,
      decimals: DIGITS
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
      denomination: decimals,
      decimals: DIGITS
    });
    tokenBalance = tokenAmount;
  }

  let denominatedEgldBalance = ZERO;
  let balanceMinusDust = balance;
  if (balance && isEgldTransaction) {
    const {
      entireBalance: denominatedBalance,
      entireBalanceMinusDust
    } = getEntireBalance({
      balance,
      gasPrice: nominate(gasPrice),
      gasLimit: gasLimit,
      denomination: DECIMALS,
      decimals: DIGITS,
      chainId
    });
    denominatedEgldBalance = denominatedBalance;
    balanceMinusDust = entireBalanceMinusDust;
  }

  const esdtAmountAvailable = nft && nftBalance ? nftBalance : tokenBalance;

  const maxAmountAvailable = isEgldTransaction
    ? denominatedEgldBalance
    : esdtAmountAvailable;

  const maxAmountMinusDust = isEgldTransaction
    ? balanceMinusDust
    : maxAmountAvailable;

  return {
    maxAmountAvailable: maxAmountAvailable || ZERO,
    maxAmountMinusDust: maxAmountMinusDust || ZERO
  };
}
