import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { PartialTokenType, ValuesEnum } from 'types';

import styles from './amountSelect.styles.scss';
import {
  AmountInput,
  AmountInputPropsType,
  MaxButton,
  MaxButtonPropsType,
  OptionType,
  TokenSelect,
  TokenSelectType
} from './components';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { SingleValue } from 'react-select';
import { getIsDisabled } from 'helpers';

export const DappFormAmountSelect = () => {
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

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
  name: string;
  tokenSelectProps: TokenSelectType;
  amountInputProps: AmountInputPropsType;
  maxButtonProps: MaxButtonPropsType;
}

export const AmountSelect = ({
  className,
  label,
  name,
  tokenSelectProps,
  amountInputProps,
  maxButtonProps
}: AmountSelectPropsType) => {
  const isInvalid = amountInputProps.isInvalid || tokenSelectProps.isInvalid;
  const error = amountInputProps.error || tokenSelectProps.error;
  const errorDataTestId = amountInputProps.error
    ? `${amountInputProps.name}Error`
    : `${tokenSelectProps.name}Error`;

  // TODO: remove BS classes or pass from above?
  const generatedClasses = {
    group: 'form-group text-left mb-0',
    label: 'mb-2 line-height-1 text-secondary',
    small: 'd-flex flex-column flex-sm-row my-2',
    error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
    balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
    maxBtn: `${styles.badgeHolder} d-flex align-content-center justify-content-end`,
    wrapper: classNames(styles.tokenAmountInputSelectMax, {
      'is-invalid': isInvalid
    })
  };

  return (
    <div className={generatedClasses.group}>
      {label && (
        <label
          htmlFor={name}
          className={`${generatedClasses.label} text-secondary`}
        >
          {label}
        </label>
      )}

      <div className={generatedClasses.wrapper}>
        <div className={classNames(styles.selectTokenContainer, className)}>
          <div className={generatedClasses.wrapper}>
            <AmountInput {...amountInputProps} />

            <div className={generatedClasses.maxBtn}>
              <MaxButton {...maxButtonProps} />
            </div>

            <TokenSelect {...tokenSelectProps} />
          </div>

          {isInvalid && (
            <div className={globals.error} data-testid={errorDataTestId}>
              <small>{error}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
