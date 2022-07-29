import React from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import Select, { SingleValue } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled, selectCustomStyles } from 'helpers';
import { TokenType, TokenAssetsType, ValuesEnum } from 'types';

import styles from './styles.module.scss';
import { TokenElement } from './TokenElement';

interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: TokenType;
}

export const SelectToken = ({ label }: { label?: string }) => {
  const { formInfo, accountInfo, tokensInfo } = useSendFormContext();

  const { readonly } = formInfo;
  const { balance } = accountInfo;
  const {
    getTokens,
    areTokensLoading,
    tokens,
    tokenId,
    egldLabel,
    tokenIdError,
    onChangeTokenId,
    isTokenIdInvalid
  } = tokensInfo;

  const FormatOptionLabel = ({ token }: { token: TokenType }) => (
    <TokenElement
      inDropdown
      token={token}
      isEgld={token.identifier === egldLabel}
    />
  );

  const allTokens: TokenType[] = [
    {
      name: 'Elrond eGold',
      identifier: egldLabel,
      balance,
      decimals: constants.denomination,
      ticker: ''
    },
    ...tokens
  ];

  const options: Array<OptionType> = allTokens.map(
    (token: TokenType): OptionType => ({
      value: token.identifier,
      label: token.name,
      assets: token.assets,
      token
    })
  );

  async function onMenuOpen() {
    await getTokens();
  }

  const onChange = (props: SingleValue<OptionType>) => {
    if (props) {
      onChangeTokenId(props.value);
    }
  };

  const filterOptions = (
    { value, label: filterLabel }: FilterOptionOption<OptionType>,
    input: string
  ) => {
    if (Boolean(input)) {
      const trimmedInput = input.trim().toLowerCase();
      const match = (option: string) =>
        option.toLowerCase().indexOf(trimmedInput) > -1;

      return match(value) || match(filterLabel);
    }

    return true;
  };

  const docStyle = window.getComputedStyle(document.documentElement);
  const selectStyle = selectCustomStyles({ docStyle });

  return (
    <div className={styles.selectToken}>
      {label && (
        <label
          htmlFor={ValuesEnum.tokenId}
          data-testid='tokenIdLabel'
          className={styles.selectTokenLabel}
        >
          {label}
        </label>
      )}

      <Select
        inputId={ValuesEnum.tokenId}
        name={ValuesEnum.tokenId}
        openMenuOnFocus
        isDisabled={getIsDisabled(ValuesEnum.tokenId, readonly)}
        isLoading={areTokensLoading}
        styles={selectStyle}
        value={
          options.find(({ value }: OptionType) => value === tokenId) ||
          undefined
        }
        options={options}
        onChange={onChange}
        onMenuOpen={onMenuOpen}
        filterOption={filterOptions}
        formatOptionLabel={FormatOptionLabel}
      />

      {isTokenIdInvalid && (
        <div className={globals.error} data-testid='tokenIdError'>
          <small>{tokenIdError}</small>
        </div>
      )}
    </div>
  );
};
