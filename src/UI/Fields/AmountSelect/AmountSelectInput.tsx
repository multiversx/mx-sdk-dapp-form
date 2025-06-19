import React, { useMemo } from 'react';
import { DECIMALS } from '@multiversx/sdk-dapp-utils/out';
import { getIdentifierType } from '@multiversx/sdk-dapp/out/utils/validation/getIdentifierType';
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
    getTokens,
    isTokenIdInvalid,
    EgldIcon,
    nft,
    onChangeTokenId,
    tokenDetails,
    tokenId,
    tokenIdError
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
        // Clear the amount on token change
        onChangeTokenId(props.value);
        onChange('');
      }
    },
    onMenuOpen: getTokens,
    disabled: getIsDisabled(ValuesEnum.tokenId, readonly),
    error: tokenIdError,
    isInvalid: isTokenIdInvalid,
    egldLabel,
    chainId,
    EgldIcon
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

  // Only show the "Required" error if user has not filled in any value (filter out insufficient funds error triggered by gas validation)
  const isValueMissing =
    checkInvalid(ValuesEnum.amount) && !amountInputProps.value;

  const amountErrorProps: AmountErrorPropsType = {
    hasErrors:
      amountInputProps.isInvalid ||
      tokenSelectProps.isInvalid ||
      isValueMissing,
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
      decimals: tokenDetails.decimals || DECIMALS,
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
