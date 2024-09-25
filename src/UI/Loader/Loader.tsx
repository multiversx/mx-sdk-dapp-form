import React from 'react';
import { Loader as SendLoader } from '@multiversx/sdk-dapp/UI/Loader/index';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export const LoaderComponent = ({ styles }: WithStylesImportType) => (
  <div className={styles?.loader}>
    <SendLoader />
  </div>
);

export const Loader = withStyles(LoaderComponent, {
  ssrStyles: () => import('UI/Loader/styles.scss'),
  clientStyles: () => require('UI/Loader/styles.scss').default
});
