import React from 'react';
import { InfoDust } from 'UI/InfoDust';

interface InfoDustPropsType {
  egldLabel: string;
  amount: string;
  maxAmountMinusDust?: string;
  isMaxClicked?: boolean;
  tokenId?: string;
}

export const EgldInfoDust = ({
  egldLabel,
  amount,
  maxAmountMinusDust,
  isMaxClicked,
  tokenId
}: InfoDustPropsType) => {
  const showInfoDust =
    amount === maxAmountMinusDust && isMaxClicked && tokenId === egldLabel;

  if (!showInfoDust) {
    return null;
  }

  return (
    <span>
      <InfoDust egldLabel={egldLabel} />
    </span>
  );
};
