import React from 'react';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue/index';
import { InfoDust } from 'UI/InfoDust';
import { OptionType } from './TokenSelect';

export interface UsdAmountPropsType {
  token?: OptionType['token'];
  amount: string;
  egldLabel: string;
}

// TODO: add styling
export const UsdAmount = ({ amount, token, egldLabel }: UsdAmountPropsType) => {
  if (!token) {
    return null;
  }

  const { identifier, totalUsdPrice } = token;
  const showInfoDust = identifier === egldLabel;

  return (
    <>
      {totalUsdPrice && (
        <UsdValue
          amount={amount}
          usd={totalUsdPrice}
          data-testid={`egldPrice_${totalUsdPrice}`}
        />
      )}

      {showInfoDust && (
        <span>
          <InfoDust egldLabel={egldLabel} />
        </span>
      )}
    </>
  );
};
