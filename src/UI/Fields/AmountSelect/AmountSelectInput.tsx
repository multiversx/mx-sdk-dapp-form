import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import globals from 'assets/sass/globals.module.scss';
import { NftEnumType, PartialTokenType, ValuesEnum } from 'types';
import {
  AmountErrorPropsType,
  AmountInputPropsType,
  MaxButtonPropsType,
  OptionType,
  TokenBalancePropsType,
  TokenSelectType
} from './components';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { SingleValue } from 'react-select';
import { getIsDisabled } from 'helpers';
import { AmountSelect } from './AmountSelect';

/**
 * Gets form state and renders a connected `AmountSelect` component
 */
export const AmountSelectInput = () => {
  const { tokensInfo, amountInfo, formInfo } = useSendFormContext();
  const { readonly } = formInfo;

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
  const { tokens, egldLabel, areTokensLoading, tokenId, onChangeTokenId, nft } =
    tokensInfo;

  const allTokens: PartialTokenType[] = [
    {
      name: 'MultiversX eGold',
      identifier: egldLabel,
      balance,
      decimals: DECIMALS,
      ticker: ''
    },
    ...tokens
  ];

  const options: OptionType[] = allTokens.map((token: PartialTokenType) => ({
    value: token.identifier,
    label: token.name,
    assets: token.assets,
    token
  }));

  const value = options.find(({ value }: OptionType) => value === tokenId);

  const tokenSelectProps: TokenSelectType = {
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
    disabled: getIsDisabled(ValuesEnum.tokenId, readonly),
    error: tokenIdError,
    isInvalid: isTokenIdInvalid
  };

  const amountInputProps: AmountInputPropsType = {
    name: ValuesEnum.amount,
    required: true,
    value: amount,
    placeholder: 'Amount',
    handleBlur: onBlur,
    'data-testid': 'amountInput',
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
      ? `${amountInputProps.name}Error`
      : `${tokenSelectProps.name}Error`
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
