import React from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants/index';
import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import classNames from 'classnames';
import Select, { SingleValue } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled, selectCustomStyles } from 'helpers';
import { PartialTokenType, TokenAssetsType, ValuesEnum } from 'types';

import styles from './amountSelect.module.scss';
import { ListOption, TokenElement } from './components';

interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType;
}

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
}

const generatedClasses = {
  group: 'form-group text-left mb-0',
  label: 'mb-2 line-height-1 text-secondary',
  small: 'd-flex flex-column flex-sm-row my-2',
  error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
  balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
  maxBtn: 'badge-holder d-flex align-content-center justify-content-end',
  wrapper: classNames('token-amount-input-select-max', {
    'is-invalid': false
  })
};

export const AmountSelect = ({ className, label }: AmountSelectPropsType) => {
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

  const FormatOptionLabel = ({ token }: { token: PartialTokenType }) => {
    return (
      <TokenElement
        inDropdown
        token={token}
        isEgld={token.identifier === egldLabel}
      />
    );
  };

  const allTokens: PartialTokenType[] = [
    {
      name: 'Elrond eGold',
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

  const docStyle = window.getComputedStyle(document.documentElement);
  const selectStyle = selectCustomStyles({ docStyle });

  return (
    <div className={generatedClasses.group}>
      <label
        // htmlFor={name}
        className={`${generatedClasses.label} text-secondary`}
      >
        Amount Select 1
      </label>

      <div className={generatedClasses.wrapper}>
        <div className='amount-holder w-100'>
          <div className={classNames(styles.selectTokenContainer, className)}>
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
              <div className={globals.error} data-testid='tokenIdError'>
                <small>{tokenIdError}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
