import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import React, { PropsWithChildren } from 'react';

export interface AmountErrorPropsType
  extends WithClassnameType,
    PropsWithChildren {
  hasErrors?: boolean;
  error?: string;
}

export const AmountError = ({
  hasErrors,
  className,
  error,
  'data-testid': dataTestId
}: AmountErrorPropsType) => {
  if (!hasErrors) {
    return null;
  }
  return (
    <div className={className} data-testid={dataTestId}>
      {error}
    </div>
  );
};
