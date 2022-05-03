import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { EgldAmount } from './EgldAmount';
import { EsdtAmount } from './EsdtAmount';
import { NftAmount } from './NftAmount';

export function Amount() {
  const { formInfo } = useSendFormContext();
  const { isNftTransaction, isEsdtTransaction } = formInfo;

  if (isNftTransaction) {
    return <NftAmount />;
  }

  if (isEsdtTransaction) {
    return <EsdtAmount />;
  }

  return <EgldAmount />;
}
