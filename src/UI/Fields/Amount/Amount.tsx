import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { EgldAmount } from './EgldAmount';
import { EsdtAmount } from './EsdtAmount';
import { NftAmount } from './NftAmount';

export const Amount = ({ className }: WithClassnameType) => {
  const { formInfo } = useSendFormContext();
  const { isNftTransaction, isEsdtTransaction } = formInfo;

  if (isNftTransaction) {
    return <NftAmount className={className} />;
  }

  if (isEsdtTransaction) {
    return <EsdtAmount className={className} />;
  }

  return <EgldAmount className={className} />;
};
