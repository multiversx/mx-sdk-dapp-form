import React, { PropsWithChildren } from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export interface AmountErrorPropsType
  extends WithClassnameType,
    PropsWithChildren {
  hasErrors?: boolean;
  error?: string;
}

export const AmountErrorComponent = ({
  hasErrors,
  className,
  error,
  'data-testid': dataTestId,
  globalStyles
}: AmountErrorPropsType & WithStylesImportType) => {
  if (!hasErrors) {
    return null;
  }
  return (
    <div
      className={classNames(globalStyles?.error, className)}
      data-testid={dataTestId}
    >
      {error}
    </div>
  );
};

export const AmountError = withStyles(AmountErrorComponent, {
  ssrStyles: () => import('UI/Fields/AmountSelect/styles.scss'),
  clientStyles: () => require('UI/Fields/AmountSelect/styles.scss').default
});
