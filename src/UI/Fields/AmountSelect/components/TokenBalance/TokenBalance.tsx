import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';

import { OptionType } from '../TokenSelect';

export interface TokenBalancePropsType extends WithClassnameType {
  label?: string;
  value?: string;
  token?: OptionType['token'];
  'data-value'?: string; // used for testing
}

export const TokenBalanceComponent = ({
  label,
  value,
  className,
  token,
  'data-testid': dataTestId,
  'data-value': dataValue,
  styles
}: TokenBalancePropsType & WithStylesImportType) => {
  return (
    <div
      data-testid={dataTestId}
      data-value={dataValue}
      className={classNames(styles?.balance, className)}
    >
      <span>{label}: </span>
      {value} {token?.ticker}
    </div>
  );
};

export const TokenBalance = withStyles(TokenBalanceComponent, {
  ssrStyles: () =>
    import(
      'UI/Fields/AmountSelect/components/TokenBalance/tokenBalance.module.scss'
    ),
  clientStyles: () =>
    require('UI/Fields/AmountSelect/components/TokenBalance/tokenBalance.module.scss')
      .default
});
