import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';
import { EgldAmount } from './EgldAmount';
import { EsdtAmount } from './EsdtAmount';
import { NftAmount } from './NftAmount';

export function Amount({
  label,
  TokenSelector
}: {
  label?: string;
  TokenSelector?: React.ReactNode;
}) {
  const { formInfo } = useSendFormContext();
  const { isNftTransaction, isEsdtTransaction } = formInfo;
  const { formAmountField: classes } = useUICustomizationContext();

  if (isNftTransaction) {
    return (
      <NftAmount
        TokenSelector={TokenSelector}
        label={label || ''}
        customClasses={classes}
      />
    );
  }

  if (isEsdtTransaction) {
    return (
      <EsdtAmount
        TokenSelector={TokenSelector}
        label={label || ''}
        customClasses={classes}
      />
    );
  }

  return (
    <EgldAmount
      TokenSelector={TokenSelector}
      label={label || ''}
      customClasses={classes}
    />
  );
}
