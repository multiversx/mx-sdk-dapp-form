import React from 'react';
import { InfoDust } from 'UI/InfoDust';
import { OptionType } from './TokenSelect';

interface InfoDustPropsType {
  egldLabel: string;
  amount: string;
  maxAmountMinusDust?: string;
  isMaxClicked?: boolean;
  token?: OptionType['token'];
}

export const EgldInfoDust = ({
  egldLabel,
  amount,
  maxAmountMinusDust,
  isMaxClicked,
  token
}: InfoDustPropsType) => {
  const showInfoDust =
    amount === maxAmountMinusDust &&
    isMaxClicked &&
    token?.identifier === egldLabel;

  console.log({ amount, maxAmountMinusDust, isMaxClicked }, token?.identifier);

  if (!showInfoDust) {
    return null;
  }

  return (
    <span>
      <InfoDust egldLabel={egldLabel} />
    </span>
  );
};
