import React, { MouseEvent } from 'react';
import { DECIMALS } from '@multiversx/sdk-dapp-utils/out';
import BigNumber from 'bignumber.js';

import classNames from 'classnames';
import { PartialTokenType } from 'types/tokens';

import { getBalanceMinusDust } from './getBalanceMinusDust';
import styles from './maxButton.module.scss';
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

export const MaxButton = ({
  token,
  egldLabel,
  inputAmount,
  className,
  onMaxClick
}: MaxButtonPropsType) => {
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
      className={classNames(styles.max, className)}
      onClick={handleOnMaxBtnClick}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      Max
    </a>
  );
};
