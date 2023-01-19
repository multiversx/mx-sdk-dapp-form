import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import globals from 'assets/sass/globals.module.scss';
import { NftEnumType, ValuesEnum } from 'types';
import {
  AmountErrorPropsType,
  AmountInputPropsType,
  MaxButtonPropsType,
  OptionType,
  TokenBalancePropsType,
  TokenSelectPropsType
} from './components';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { SingleValue } from 'react-select';
import { getIsDisabled } from 'helpers';
import { AmountSelect } from './AmountSelect';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import { useGetEconomicsInfo } from 'contexts/TokensContext/utils/useGetEconomicsInfo';

/**
 * Gets form state and renders a connected `AmountSelect` component
 */
export const AmountSelectInput = () => {
  const { tokensInfo, amountInfo, formInfo } = useSendFormContext();
  const { readonly } = formInfo;
  const { egldPriceInUsd } = useGetEconomicsInfo();

  const {
    networkConfig: { egldLabel, chainId }
  } = useNetworkConfigContext();

  const { tokenDetails, tokenIdError, isTokenIdInvalid } = tokensInfo;

  const {
    amount,
    onBlur,
    onChange,
    onMaxClicked,
    error,
    isInvalid,
    onFocus,
    maxAmountAvailable
  } = amountInfo;

  const { accountInfo } = useSendFormContext();

  const { balance } = accountInfo;
  const { tokens, areTokensLoading, tokenId, onChangeTokenId, nft, getTokens } =
    tokensInfo;

  const allTokens: Array<OptionType['token']> = [
    {
      name: 'MultiversX eGold',
      identifier: egldLabel,
      balance,
      decimals: DECIMALS,
      ticker: '',
      tokenUsdPrice: egldPriceInUsd
    },
    ...tokens
  ];

  const options: OptionType[] = allTokens.map((token) => ({
    value: token.identifier,
    label: token.name,
    assets: token.assets,
    token
  }));

  const value = options.find(({ value }: OptionType) => value === tokenId);

  const tokenSelectProps: TokenSelectPropsType = {
    id: ValuesEnum.tokenId,
    value,
    name: ValuesEnum.tokenId,
    isLoading: areTokensLoading,
    options,
    isSearchable: true,
    onChange: (props: SingleValue<OptionType>) => {
      if (props) {
        onChangeTokenId(props.value);
      }
    },
    onMenuOpen: getTokens,
    disabled: getIsDisabled(ValuesEnum.tokenId, readonly),
    error: tokenIdError,
    isInvalid: isTokenIdInvalid,
    egldLabel,
    chainId
  };

  const amountInputProps: AmountInputPropsType = {
    name: ValuesEnum.amount,
    required: true,
    value: amount,
    placeholder: 'Amount',
    handleBlur: onBlur,
    'data-testid': ValuesEnum.amount,
    handleChange: onChange,
    onFocus,
    error,
    isInvalid
  };

  const maxButtonProps: MaxButtonPropsType = {
    token: tokenDetails,
    inputAmount: amount,
    onMaxClick: onMaxClicked
  };

  const amountErrorProps: AmountErrorPropsType = {
    hasErrors: amountInputProps.isInvalid || tokenSelectProps.isInvalid,
    error: amountInputProps.error || tokenSelectProps.error,
    className: globals.error,
    'data-testid': amountInputProps.error
      ? `${ValuesEnum.amount}Error`
      : `${ValuesEnum.tokenId}Error`
  };

  const tokenBalanceProps: TokenBalancePropsType = {
    label: 'Available',
    value: maxAmountAvailable,
    'data-testid': `available${nft?.identifier ?? tokenId}`,
    'data-value': `${maxAmountAvailable} ${nft?.identifier ?? tokenId}`
  };

  if (nft?.type === NftEnumType.NonFungibleESDT) {
    return null;
  }

  return (
    <AmountSelect
      name={ValuesEnum.tokenId}
      amountErrorProps={amountErrorProps}
      tokenSelectProps={tokenSelectProps}
      amountInputProps={amountInputProps}
      tokenBalanceProps={tokenBalanceProps}
      maxButtonProps={maxButtonProps}
      label='Amount Select'
    />
  );
};
