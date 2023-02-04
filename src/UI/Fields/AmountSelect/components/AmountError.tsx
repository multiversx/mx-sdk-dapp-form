import React, { PropsWithChildren } from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';

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
    <div
      className={classNames(globals.error, className)}
      data-testid={dataTestId}
    >
      {error}
    </div>
  );
};
