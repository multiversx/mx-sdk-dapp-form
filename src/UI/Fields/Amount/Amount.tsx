import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { EgldAmount } from './EgldAmount';
import { EsdtAmount } from './EsdtAmount';
import { NftAmount } from './NftAmount';

export const Amount = () => {
  const { formInfo } = useSendFormContext();
  const { isNftTransaction, isEsdtTransaction } = formInfo;

  console.log('YESSS');

  if (isNftTransaction) {
    return <NftAmount />;
  }

  if (isEsdtTransaction) {
    return <EsdtAmount />;
  }

  return <EgldAmount />;
};
