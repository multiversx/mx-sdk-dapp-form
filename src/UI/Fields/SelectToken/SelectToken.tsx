import React from 'react';
import * as constants from '@multiversx/sdk-dapp/constants/index';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import Select, { SingleValue, components } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled, selectCustomStyles } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { PartialTokenType, TokenAssetsType, ValuesEnum } from 'types';

import { TokenElement } from './TokenElement';

interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType;
}

export interface SelectTokenPropsType extends WithClassnameType {
  label?: string;
}

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

export const SelectTokenComponent = ({
  className,
  label,
  globalStyles,
  styles
}: SelectTokenPropsType & WithStylesImportType) => {
  const { formInfo, accountInfo, tokensInfo } = useSendFormContext();

  const { readonly } = formInfo;
  const { balance } = accountInfo;
  const {
    getTokens,
    areTokensLoading,
    tokens,
    tokenId,
    egldLabel,
    EgldIcon,
    tokenIdError,
    onChangeTokenId,
    isTokenIdInvalid
  } = tokensInfo;

  const FormatOptionLabel = ({ token }: { token: PartialTokenType }) => {
    return (
      <TokenElement
        inDropdown
        token={token}
        isEgld={token.identifier === egldLabel}
        EgldIcon={EgldIcon}
      />
    );
  };

  const allTokens: PartialTokenType[] = [
    {
      name: 'MultiversX eGold',
      identifier: egldLabel,
      balance,
      decimals: constants.DECIMALS,
      ticker: ''
    },
    ...tokens
  ];

  const options: Array<OptionType> = allTokens.map(
    (token: PartialTokenType): OptionType => ({
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

  const docStyle = window?.getComputedStyle(document?.documentElement);
  const selectStyle = selectCustomStyles({ docStyle });

  return (
    <div className={classNames(styles?.selectTokenContainer, className)}>
      {label && (
        <label
          htmlFor={ValuesEnum.tokenId}
          data-testid={FormDataTestIdsEnum.tokenIdLabel}
          className={styles?.selectTokenLabel}
        >
          {label}
        </label>
      )}

      <Select
        className='selectToken'
        classNamePrefix='selectToken'
        components={{ Option: ListOption }}
        filterOption={filterOptions}
        formatOptionLabel={FormatOptionLabel}
        inputId={ValuesEnum.tokenId}
        isDisabled={getIsDisabled(ValuesEnum.tokenId, readonly)}
        isLoading={areTokensLoading}
        name={ValuesEnum.tokenId}
        onChange={onChange}
        onMenuOpen={onMenuOpen}
        openMenuOnFocus
        options={options}
        styles={className ? {} : selectStyle}
        value={
          options.find(({ value }: OptionType) => value === tokenId) ||
          undefined
        }
      />

      {isTokenIdInvalid && (
        <div
          className={globalStyles?.error}
          data-testid={FormDataTestIdsEnum.tokenIdError}
        >
          <small>{tokenIdError}</small>
        </div>
      )}
    </div>
  );
};

export const SelectToken = withStyles(SelectTokenComponent, {
  ssrStyles: () => import('UI/Fields/SelectToken/styles.scss'),
  clientStyles: () => require('UI/Fields/SelectToken/styles.scss').default
});
