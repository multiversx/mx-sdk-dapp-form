import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import styles from './amountSelect.module.scss';

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
  const showUsdValue =
    !amountErrorProps.hasErrors &&
    amountInputProps.value &&
    tokenSelectProps.value?.token.tokenUsdPrice;

  return (
    <div className={classNames(styles.amount, className)}>
      {label && (
        <label htmlFor={name} className={globals.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <AmountInput {...amountInputProps} />

        <div className={styles.interaction}>
          {maxButtonProps.isMaxButtonVisible !== false && (
            <MaxButton {...maxButtonProps} />
          )}

          <div className={styles.select}>
            <TokenSelect {...tokenSelectProps} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div>
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
            <AmountError {...amountErrorProps} />
          )}
        </div>

        <TokenBalance {...tokenBalanceProps} />
      </div>
    </div>
  );
};
