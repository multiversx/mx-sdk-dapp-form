import React from 'react';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { SingleValue } from 'react-select';
import globals from 'assets/sass/globals.module.scss';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useGetEconomicsInfo } from 'contexts/TokensContext/utils/useGetEconomicsInfo';
import { getIsDisabled } from 'helpers';
import { NftEnumType, ValuesEnum } from 'types';
import { AmountSelect } from './AmountSelect';
import {
  AmountErrorPropsType,
  AmountInputPropsType,
  MaxButtonPropsType,
  OptionType,
  TokenBalancePropsType,
  TokenSelectPropsType
} from './components';
import { progressiveFormatAmount } from './components/MaxButton/progressiveFormatAmount';

/**
 * Gets form state and renders a connected `AmountSelect` component
 */
export const AmountSelectInput = () => {
  const { tokensInfo, amountInfo, formInfo } = useSendFormContext();
  const { readonly } = formInfo;

  const {
    networkConfig: { egldLabel, chainId }
  } = useNetworkConfigContext();
  const { egldPriceInUsd } = useGetEconomicsInfo();

  const { tokenDetails, tokenIdError, isTokenIdInvalid } = tokensInfo;

  const {
    amount,
    onBlur,
    onChange,
    onMaxClicked,
    error,
    isInvalid,
    onFocus,
    maxAmountAvailable,
    isMaxClicked,
    isMaxButtonVisible,
    maxAmountMinusDust
  } = amountInfo;

  const {
    allAvailableTokens,
    areTokensLoading,
    tokenId,
    onChangeTokenId,
    nft,
    getTokens
  } = tokensInfo;

  const options: OptionType[] = allAvailableTokens.map((token) => ({
    value: token.identifier,
    label: token.name,
    assets: token.assets,
    token
  }));

  const { isEgld } = getIdentifierType(tokenId);

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
    isMaxClicked,
    tokenId,
    onFocus,
    egldLabel,
    tokenUsdPrice: isEgld ? egldPriceInUsd : undefined,
    error,
    isInvalid,
    maxAmountMinusDust
  };

  const maxButtonProps: MaxButtonPropsType = {
    token: tokenDetails,
    inputAmount: amount,
    onMaxClick: onMaxClicked,
    isMaxClicked,
    isMaxButtonVisible
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
    'data-testid': `available${nft?.identifier ?? tokenId}`,
    'data-value': `${maxAmountAvailable} ${nft?.identifier ?? tokenId}`,
    label: 'Available',
    value: progressiveFormatAmount({
      amount: tokenDetails.balance,
      decimals: tokenDetails.decimals,
      addCommas: true
    })
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
      label='Amount'
    />
  );
};
