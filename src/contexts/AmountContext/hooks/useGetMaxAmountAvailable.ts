import { useEffect, useState } from 'react';
import { nominate } from '@elrondnetwork/dapp-core';
import { useFormikContext } from 'formik';
import { decimals, denomination } from 'config';
import { entireBalance, entireTokenBalance } from 'helpers';
import { NftEnumType } from 'types';
import { ExtendedValuesType } from '../../../logic';
import { getTokenDetails } from '../../../logic/operations';
import { useAccountContext } from '../../AccountContext';
import { useFormContext } from '../../FormContext';
import { useGasContext } from '../../GasContext';
import { useTokensContext } from '../../TokensContext';

interface UseGetMaxAmountAvailableReturnType {
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
}

export function useGetMaxAmountAvailable(): UseGetMaxAmountAvailableReturnType {
  const { values } = useFormikContext<ExtendedValuesType>();
  const { balance, chainId } = useAccountContext();

  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [nftBalance, setNftBalance] = useState<string | null>(null);
  const [denominatedEgldBalance, setDenominatedEgldBalance] = useState('0');
  const [balanceMinusDust, setBalanceMinusDust] = useState(balance);

  const { nft, tokens } = useTokensContext();
  const { isEsdtTransaction, isNftTransaction, isEgldTransaction } =
    useFormContext();
  const { gasLimit, gasPrice } = useGasContext();
  const { tokenId, txType } = values;

  useEffect(() => {
    if (isNftTransaction && nft) {
      const computedNftBalance = entireTokenBalance({
        balance: nft.balance,
        denomination: nft.type === NftEnumType.MetaESDT ? nft.decimals : 0,
        decimals
      });
      setNftBalance(computedNftBalance);
    }
  }, [nft]);

  useEffect(() => {
    if (isEsdtTransaction) {
      const { tokenDenomination, tokenBalance: newTokenBalance } =
        getTokenDetails({
          tokens,
          tokenId
        });

      const tokenAmount = entireTokenBalance({
        balance: newTokenBalance,
        denomination: tokenDenomination,
        decimals
      });
      setTokenBalance(tokenAmount);
    }
  }, [txType, tokenId, isEsdtTransaction, tokens]);

  useEffect(() => {
    if (balance && isEgldTransaction) {
      const { entireBalance: denominatedBalance, entireBalanceMinusDust } =
        entireBalance({
          balance,
          gasPrice: nominate(gasPrice),
          gasLimit: gasLimit,
          denomination,
          decimals,
          chainId
        });
      setDenominatedEgldBalance(denominatedBalance);
      setBalanceMinusDust(entireBalanceMinusDust);
    }
  }, [balance, gasLimit, gasPrice]);

  const esdtAmountAvailable = nft && nftBalance ? nftBalance : tokenBalance;

  const maxAmountAvailable = isEgldTransaction
    ? denominatedEgldBalance
    : esdtAmountAvailable;

  const maxAmountMinusDust = isEgldTransaction
    ? balanceMinusDust
    : maxAmountAvailable;

  return {
    maxAmountAvailable: maxAmountAvailable || '0',
    maxAmountMinusDust: maxAmountMinusDust || '0'
  };
}
