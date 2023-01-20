import React from 'react';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue/index';
import { OptionType } from './TokenSelect';

export interface UsdAmountPropsType {
  token?: OptionType['token'];
  amount: string;
}

// TODO: add styling
export const UsdAmount = ({ amount, token }: UsdAmountPropsType) => {
  if (!token) {
    return null;
  }

  const { tokenUsdPrice: totalUsdPrice } = token;

  if (!totalUsdPrice) {
    return null;
  }

  return (
    <UsdValue
      amount={amount}
      usd={totalUsdPrice}
      data-testid={`egldPrice_${totalUsdPrice}`}
    />
  );
};
