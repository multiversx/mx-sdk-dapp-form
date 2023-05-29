import React, { useMemo } from 'react';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { SingleValue } from 'react-select';
import globals from 'assets/sass/globals.module.scss';
import { useFormContext } from 'contexts';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useGetEconomicsInfo } from 'contexts/TokensContext/utils/useGetEconomicsInfo';
import { getIsDisabled } from 'helpers';
import { NftEnumType, ValuesEnum } from 'types';
import { AmountSelect } from './AmountSelect';
import {
  AmountErrorPropsType,
  AmountInputPropsType,
  EgldInfoDust,
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
  const { checkInvalid } = useFormContext();
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
    label: String(token.ticker),
    assets: token.assets,
    token
  }));

  const { isEgld } = getIdentifierType(tokenId);

  const selectValue = options.find(
    ({ value }: OptionType) => value === tokenId
  );

  const tokenSelectProps: TokenSelectPropsType = {
    id: ValuesEnum.tokenId,
    value: selectValue,
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

  const InfoDustComponent = useMemo(
    () => (
      <EgldInfoDust
        amount={amount}
        egldLabel={egldLabel}
        maxAmountMinusDust={maxAmountMinusDust}
        tokenId={tokenId}
        isMaxClicked={isMaxClicked}
      />
    ),
    [amount, egldLabel, maxAmountMinusDust, tokenId, isMaxClicked]
  );

  const amountInputProps: AmountInputPropsType = {
    name: ValuesEnum.amount,
    required: true,
    value: amount,
    placeholder: 'Amount',
    handleBlur: onBlur,
    'data-testid': ValuesEnum.amount,
    handleChange: onChange,
    onFocus,
    usdPrice: isEgld ? egldPriceInUsd : undefined,
    error,
    isInvalid,
    InfoDustComponent
  };

  const maxButtonProps: MaxButtonPropsType = {
    token: tokenDetails,
    inputAmount: amount,
    onMaxClick: onMaxClicked,
    isMaxClicked,
    isMaxButtonVisible
  };

  const amountErrorProps: AmountErrorPropsType = {
    hasErrors:
      amountInputProps.isInvalid ||
      tokenSelectProps.isInvalid ||
      (checkInvalid(ValuesEnum.amount) && !Boolean(amountInputProps.value)),
    error: amountInputProps.error || tokenSelectProps.error,
    className: globals.error,
    'data-testid': amountInputProps.error
      ? `${ValuesEnum.amount}Error`
      : `${ValuesEnum.tokenId}Error`
  };

  const tokenBalanceProps: TokenBalancePropsType = {
    'data-testid': `available-${nft?.identifier ?? tokenId}`,
    'data-value': `${maxAmountAvailable} ${nft?.identifier ?? tokenId}`,
    label: 'Available',
    token: selectValue?.token,
    value: progressiveFormatAmount({
      amount: tokenDetails.balance,
      decimals: tokenDetails.decimals,
      addCommas: true,
      showLastNonZeroDecimal: true
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
      readonly={readonly}
    />
  );
};
