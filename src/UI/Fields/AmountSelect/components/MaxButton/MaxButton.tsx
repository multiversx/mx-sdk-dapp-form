import { useGetEconomicsInfo } from 'contexts/TokensContext/utils/useGetEconomicsInfo';
import React, { MouseEvent } from 'react';

import { PartialTokenType } from 'types/tokens';

import { progressiveFormatAmount } from './progressiveFormatAmount';
import { getBalanceMinusDust } from './getBalanceMinusDust';
import BigNumber from 'bignumber.js';

import styles from './maxButton.module.scss';

export interface MaxButtonPropsType {
  inputAmount: string;
  token?: PartialTokenType;
  isMaxClicked?: boolean;
  isMaxButtonVisible?: boolean;
  onMaxClick?: (maxAmount: string) => void;
}

export const MaxButton = ({
  token,
  inputAmount,
  onMaxClick
}: MaxButtonPropsType) => {
  const { egldLabel } = useGetEconomicsInfo();

  const isEgld = token?.identifier === egldLabel;
  const balance = token?.balance ?? '0';

  if (balance === '0') {
    return null;
  }

  const formattedBalance = progressiveFormatAmount({
    amount: isEgld ? getBalanceMinusDust(balance) : balance,
    decimals: token?.decimals
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

  // TODO: why not button?
  return (
    <a
      href='/'
      data-testid='maxBtn'
      className={styles.max}
      onClick={handleOnMaxBtnClick}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      Max
    </a>
  );
};
