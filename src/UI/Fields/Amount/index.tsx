import React from 'react';
import { useSendFormContext } from 'contexts';
import { EgldAmount } from 'UI/Fields/Amount/EgldAmount';
import { EsdtAmount } from 'UI/Fields/Amount/EsdtAmount';
import { NftAmount } from 'UI/Fields/Amount/NftAmount';

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
