import React from 'react';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ExtendedValuesType, WithClassnameType } from 'types';

import {
  AmountError,
  AmountErrorPropsType,
  AmountInput,
  AmountInputPropsType,
  MaxButton,
  MaxButtonPropsType,
  TokenBalance,
  TokenBalancePropsType,
  TokenSelect,
  TokenSelectPropsType
} from './components';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
  name: string;
  readonly?: ExtendedValuesType['readonly'];
  wrapperControlsClassName?: string;
  amountErrorProps: AmountErrorPropsType;
  tokenBalanceProps: TokenBalancePropsType;
  tokenSelectProps: TokenSelectPropsType;
  amountInputProps: AmountInputPropsType;
  maxButtonProps: MaxButtonPropsType;
}

export const AmountSelectComponent = ({
  className,
  label,
  name,
  wrapperControlsClassName,
  tokenSelectProps,
  tokenBalanceProps,
  amountInputProps,
  amountErrorProps,
  maxButtonProps,
  readonly,
  globalStyles,
  styles
}: AmountSelectPropsType & WithStylesImportType) => (
  <div className={classNames(styles?.amount, className)}>
    <div className={styles?.label}>
      {label && (
        <label
          htmlFor={name}
          className={globalStyles?.label}
          data-testid={FormDataTestIdsEnum.amountLabel}
        >
          {label}
        </label>
      )}

      <TokenBalance {...tokenBalanceProps} />
    </div>

    <div
      className={classNames(styles?.wrapper, wrapperControlsClassName, {
        [styles?.error]:
          amountInputProps.isInvalid ||
          tokenSelectProps.isInvalid ||
          amountErrorProps.hasErrors,
        [styles?.disabled]: readonly
      })}
    >
      <AmountInput {...amountInputProps} />

      <div
        className={classNames(
          styles?.interaction,
          maxButtonProps.wrapperClassName
        )}
      >
        {maxButtonProps.isMaxButtonVisible && <MaxButton {...maxButtonProps} />}

        <div className={styles?.select}>
          <TokenSelect {...tokenSelectProps} />
        </div>
      </div>
    </div>

    <AmountError {...amountErrorProps} />
  </div>
);

export const AmountSelect = withStyles(AmountSelectComponent, {
  ssrStyles: () => import('UI/Fields/AmountSelect/styles.scss'),
  clientStyles: () => require('UI/Fields/AmountSelect/styles.scss').default
});
