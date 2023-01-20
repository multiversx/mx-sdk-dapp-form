import { useGetEconomicsInfo } from 'contexts/TokensContext/utils/useGetEconomicsInfo';
import React from 'react';
import { PartialTokenType } from 'types/tokens';
import { progressiveFormatAmount } from './progressiveFormatAmount';
import { getBalanceMinusDust } from './getBalanceMinusDust';

export interface MaxButtonPropsType {
  inputAmount: string;
  token?: PartialTokenType;
  isMaxClicked?: boolean;
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

  const isInputAmountMaxAmount =
    parseFloat(inputAmount) === parseFloat(formattedBalance);

  const handleOnMaxBtnClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
      className='badge badge-pill badge-primary text-uppercase mex-text-main mex-bg-gray-light'
      onClick={handleOnMaxBtnClick}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      Max
    </a>
  );
};
