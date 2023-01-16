import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { PartialTokenType, ValuesEnum, TokenAssetsType } from 'types';

import styles from './amountSelect.styles.scss';
import { AmountInput, MaxButton, TokenSelect } from './components';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { SingleValue } from 'react-select';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
}

interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType;
}

const generatedClasses = {
  group: 'form-group text-left mb-0',
  label: 'mb-2 line-height-1 text-secondary',
  small: 'd-flex flex-column flex-sm-row my-2',
  error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
  balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
  maxBtn: `${styles.badgeHolder} d-flex align-content-center justify-content-end`,
  wrapper: classNames(styles.tokenAmountInputSelectMax, {
    'is-invalid': false
  })
};

export const AmountSelect = ({ className, label }: AmountSelectPropsType) => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { tokenDetails, tokenIdError, isTokenIdInvalid } = tokensInfo;

  const { amount, onBlur, onChange, onFocus, onMaxClicked } = amountInfo;

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

  const options: Array<OptionType> = allTokens.map(
    (token: PartialTokenType): OptionType => ({
      value: token.identifier,
      label: token.name,
      assets: token.assets,
      token
    })
  );

  const value = options.find(({ value }: OptionType) => value === tokenId);

  return (
    <div className={generatedClasses.group}>
      <label
        // htmlFor={name}
        className={`${generatedClasses.label} text-secondary`}
      >
        Amount Select 1
      </label>

      <div className={generatedClasses.wrapper}>
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

          <div className={generatedClasses.wrapper}>
            <AmountInput
              name='amount'
              required={true}
              value={amount}
              placeholder='Amount'
              handleBlur={onBlur}
              data-testid='amountInput'
              handleChange={onChange}
            />

            <div className={generatedClasses.maxBtn}>
              <MaxButton
                token={tokenDetails}
                inputAmount={amount}
                onMaxClick={onMaxClicked}
              />
            </div>

            <TokenSelect
              id={ValuesEnum.tokenId} // TODO: change
              name={ValuesEnum.tokenId} // TODO: change
              value={value}
              isSearchable
              options={options}
              onFocus={onFocus}
              onChange={(props: SingleValue<OptionType>) => {
                if (props) {
                  onChangeTokenId(props.value);
                }
              }}
              onBlur={onBlur}
              isLoading={areTokensLoading}
              // disabledOption={disabledOption}
              // handleDisabledOptionClick={handleDisabledOptionClick}
            />
          </div>

          {isTokenIdInvalid && (
            <div className={globals.error} data-testid='tokenIdError'>
              <small>{tokenIdError}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
