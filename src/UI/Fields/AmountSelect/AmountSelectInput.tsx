import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { PartialTokenType, ValuesEnum } from 'types';
import {
  AmountInputPropsType,
  MaxButtonPropsType,
  OptionType,
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

  const { amount, onBlur, onChange, onMaxClicked, error, isInvalid, onFocus } =
    amountInfo;

  const { accountInfo } = useSendFormContext();

  const { balance } = accountInfo;
  const { tokens, egldLabel, areTokensLoading, tokenId, onChangeTokenId } =
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

  return (
    <AmountSelect
      name={ValuesEnum.tokenId}
      tokenSelectProps={tokenSelectProps}
      amountInputProps={amountInputProps}
      maxButtonProps={maxButtonProps}
      label='Amount Select'
    />
  );
};
