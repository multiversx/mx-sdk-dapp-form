import React from 'react';
import { constants } from '@elrondnetwork/dapp-core';
import classnames from 'classnames';
import Select, { components } from 'react-select';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { selectCustomStyles } from 'helpers';
import { TokenType } from 'types';
import TokenElement from './TokenElement';

const ListOption = (props: any) => {
  return (
    <div
      className={`token-option ${props.isSelected ? 'is-selected' : ''}`}
      data-testid={`${props.value}-option`}
    >
      <components.Option {...props} />
    </div>
  );
};

export function SelectToken() {
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

  const FormatOptionLabel = ({ token }: { token: TokenType }) => {
    return (
      <TokenElement
        inDropdown
        token={token}
        isEgld={token.identifier === egldLabel}
      />
    );
  };

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

  const options: any = allTokens.map(({ identifier, name, assets }) => ({
    value: identifier,
    label: name,
    assets,
    token: { identifier, name, assets }
  }));

  async function onMenuOpen() {
    await getTokens();
  }

  const onChange = (props: any) => {
    if (props) {
      onChangeTokenId(props.value);
    }
  };

  const filterOptions = ({ value, label: filterLabel }: any, input: string) => {
    if (input) {
      const trimmedInput = input.trim().toLowerCase();
      return [value.toLowerCase(), filterLabel.toLowerCase()].includes(
        trimmedInput
      );
    }
    return true;
  };

  const docStyle = window.getComputedStyle(document.documentElement);
  const selectStyle = selectCustomStyles({ docStyle });

  const invalidClassname = classnames({ 'is-invalid': isTokenIdInvalid });
  return (
    <div className={`form-group select-token ${invalidClassname}`}>
      <label htmlFor='tokenId' data-testid='tokenIdLabel'>
        Token
      </label>

      <div className={`input-group input-group-seamless ${invalidClassname}`}>
        <Select
          inputId='tokenId'
          name='tokenId'
          openMenuOnFocus
          isDisabled={readonly}
          isLoading={areTokensLoading}
          styles={selectStyle}
          value={options.find(({ value }: any) => value === tokenId)}
          options={options}
          components={{ Option: ListOption }}
          className='w-100'
          classNamePrefix='react-select'
          onChange={onChange}
          onMenuOpen={onMenuOpen}
          filterOption={filterOptions}
          formatOptionLabel={FormatOptionLabel}
        />
      </div>
      {isTokenIdInvalid && (
        <div className='text-danger d-block' data-testid='tokenIdError'>
          <small>{tokenIdError}</small>
        </div>
      )}
    </div>
  );
}

export default SelectToken;
