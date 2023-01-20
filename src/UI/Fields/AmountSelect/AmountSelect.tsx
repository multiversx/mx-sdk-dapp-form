import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import styles from './amountSelect.styles.scss';
import {
  AmountError,
  AmountErrorPropsType,
  AmountInput,
  AmountInputPropsType,
  EgldInfoDust,
  MaxButton,
  MaxButtonPropsType,
  TokenBalance,
  TokenBalancePropsType,
  TokenSelect,
  TokenSelectPropsType,
  UsdAmount
} from './components';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
  name: string;
  amountErrorProps: AmountErrorPropsType;
  tokenBalanceProps: TokenBalancePropsType;
  tokenSelectProps: TokenSelectPropsType;
  amountInputProps: AmountInputPropsType;
  maxButtonProps: MaxButtonPropsType;
}

export const AmountSelect = ({
  className,
  label,
  name,
  tokenSelectProps,
  tokenBalanceProps,
  amountInputProps,
  amountErrorProps,
  maxButtonProps
}: AmountSelectPropsType) => {
  // TODO: remove BS classes or pass from above?
  const generatedClasses = {
    group: 'form-group text-left mb-0',
    label: 'mb-2 line-height-1 text-secondary',
    small: 'd-flex flex-column flex-sm-row my-2',
    error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
    balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
    maxBtn: `${styles.badgeHolder} d-flex align-content-center justify-content-end`,
    wrapper: classNames(styles.tokenAmountInputSelectMax, {
      'is-invalid': amountErrorProps.hasErrors
    })
  };

  const showUsdValue =
    !amountErrorProps.hasErrors &&
    amountInputProps.value &&
    tokenSelectProps.value?.token.tokenUsdPrice;

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
        <AmountInput {...amountInputProps} />

        <div className={generatedClasses.maxBtn}>
          <MaxButton {...maxButtonProps} />
        </div>

        <div className={classNames(styles.selectTokenContainer, className)}>
          <TokenSelect {...tokenSelectProps} />
        </div>
      </div>

      {showUsdValue ? (
        <>
          <UsdAmount
            amount={amountInputProps.value}
            token={tokenSelectProps.value?.token}
          />
          <EgldInfoDust
            amount={amountInputProps.value}
            egldLabel={tokenSelectProps.egldLabel}
            maxAmountMinusDust={amountInputProps.maxAmountMinusDust}
            token={tokenSelectProps.value?.token}
            isMaxClicked={maxButtonProps.isMaxClicked}
          />
        </>
      ) : (
        <small className={generatedClasses.small}>
          <AmountError {...amountErrorProps} />
        </small>
      )}

      <div className={generatedClasses.balance}>
        <TokenBalance {...tokenBalanceProps} />
      </div>
    </div>
  );
};
