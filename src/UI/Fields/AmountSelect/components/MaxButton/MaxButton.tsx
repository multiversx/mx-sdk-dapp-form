import React, { MouseEvent } from 'react';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { PartialTokenType } from 'types/tokens';

import { getBalanceMinusDust } from './getBalanceMinusDust';
import { progressiveFormatAmount } from './progressiveFormatAmount';

export interface MaxButtonPropsType {
  token?: PartialTokenType;
  egldLabel?: string;
  inputAmount: string;
  isMaxClicked?: boolean;
  isMaxButtonVisible?: boolean;
  onMaxClick?: (maxAmount: string) => void;
  className?: string;
  wrapperClassName?: string;
}

export const MaxButtonComponent = ({
  token,
  egldLabel,
  inputAmount,
  className,
  onMaxClick,
  styles
}: MaxButtonPropsType & WithStylesImportType) => {
  const isEgld = token?.identifier === egldLabel;
  const balance = token?.balance ?? '0';

  if (balance === '0') {
    return null;
  }

  const formattedBalance = progressiveFormatAmount({
    amount: isEgld ? getBalanceMinusDust(balance) : balance,
    decimals: token?.decimals || DECIMALS
  });

  const isInputAmountMaxAmount = new BigNumber(inputAmount).isEqualTo(
    new BigNumber(formattedBalance)
  );

  const handleOnMaxBtnClick = (event: MouseEvent) => {
    event.preventDefault();
    onMaxClick?.(formattedBalance);
  };

  if (isInputAmountMaxAmount) {
    return null;
  }

  return (
    <a
      href='/'
      data-testid='maxBtn'
      className={classNames(styles?.max, className)}
      onClick={handleOnMaxBtnClick}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      Max
    </a>
  );
};

export const MaxButton = withStyles(MaxButtonComponent, {
  ssrStyles: () =>
    import('UI/Fields/AmountSelect/components/MaxButton/styles.scss'),
  clientStyles: () =>
    require('UI/Fields/AmountSelect/components/MaxButton/styles.scss').default
});
