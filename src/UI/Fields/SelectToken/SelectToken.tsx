import React from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import Select from 'react-select';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { selectCustomStyles } from 'helpers';
import { TokenType, TokenAssetsType } from 'types';

import styles from './styles.module.scss';
import TokenElement from './TokenElement';

interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: {
    identifier: string;
    name: string;
    assets?: TokenAssetsType;
  };
}

export function SelectToken({ label }: { label?: string }) {
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
      // add type
    },
    ...tokens
    // ...metaEsdts
  ];

  const options: Array<OptionType> = allTokens.map(
    ({ identifier, name, assets }) => ({
      value: identifier,
      label: name,
      assets,
      token: { identifier, name, assets }
    })
  );

  async function onMenuOpen() {
    await getTokens();
  }

  const onChange = (props: any) => {
    if (props) {
      onChangeTokenId(props.value);
    }
  };

  const filterOptions = ({ value, label: filterLabel }: any, input: string) => {
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
    <div className={styles.token}>
      {label && (
        <label
          htmlFor='tokenId'
          data-testid='tokenIdLabel'
          className={styles.label}
        >
          {label}
        </label>
      )}

      <Select
        inputId='tokenId'
        name='tokenId'
        openMenuOnFocus
        isDisabled={readonly}
        isLoading={areTokensLoading}
        styles={selectStyle}
        value={options.find(({ value }: OptionType) => value === tokenId)}
        options={options}
        onChange={onChange}
        onMenuOpen={onMenuOpen}
        filterOption={filterOptions}
        formatOptionLabel={FormatOptionLabel}
      />

      {isTokenIdInvalid && (
        <div className={styles.error} data-testid='tokenIdError'>
          <small>{tokenIdError}</small>
        </div>
      )}
    </div>
  );
}

export default SelectToken;
