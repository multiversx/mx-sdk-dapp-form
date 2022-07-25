import { useEffect, useState } from 'react';

import {
  decimals as defaultDecimals,
  denomination as defaultDenomination
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils';
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
    networkConfig: { id: chainId }
  } = useNetworkConfigContext();

  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [nftBalance, setNftBalance] = useState<string | null>(null);
  const [denominatedEgldBalance, setDenominatedEgldBalance] = useState(ZERO);
  const [balanceMinusDust, setBalanceMinusDust] = useState(balance);

  const { nft, tokens } = useTokensContext();
  const {
    isEsdtTransaction,
    isNftTransaction,
    isEgldTransaction
  } = useFormContext();
  const { gasLimit, gasPrice } = useGasContext();
  const { tokenId, txType, customBalanceRules } = values;

  useEffect(() => {
    if (isNftTransaction && nft) {
      const computedNftBalance = getEntireTokenBalance({
        balance: nft.balance,
        denomination: nft.type === NftEnumType.MetaESDT ? nft.decimals : 0,
        decimals: defaultDecimals
      });
      setNftBalance(computedNftBalance);
    }
  }, [nft]);

  useEffect(() => {
    if (isEsdtTransaction) {
      const { decimals, balance: newTokenBalance } = getTokenDetails({
        tokens,
        tokenId
      });

      const tokenAmount = getEntireTokenBalance({
        balance: newTokenBalance,
        denomination: decimals,
        decimals: defaultDecimals
      });
      setTokenBalance(tokenAmount);
    }
  }, [txType, tokenId, isEsdtTransaction, tokens]);

  useEffect(() => {
    if (balance && isEgldTransaction) {
      console.log(customBalanceRules);

      if (customBalanceRules?.customBalance) {
        const entireBalance = denominate({
          input: customBalanceRules?.customBalance,
          denomination: defaultDenomination,
          showLastNonZeroDecimal: true,
          decimals: defaultDecimals
        });
        setDenominatedEgldBalance(entireBalance);
        setBalanceMinusDust(entireBalance);
        return;
      }
      const {
        entireBalance: denominatedBalance,
        entireBalanceMinusDust
      } = getEntireBalance({
        balance,
        gasPrice: nominate(gasPrice),
        gasLimit: gasLimit,
        denomination: defaultDenomination,
        decimals: defaultDecimals,
        chainId
      });
      setDenominatedEgldBalance(denominatedBalance);
      setBalanceMinusDust(entireBalanceMinusDust);
    }
  }, [balance, gasLimit, gasPrice, customBalanceRules]);

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
