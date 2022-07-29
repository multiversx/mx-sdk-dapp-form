import * as React from 'react';

import { Loader as SendLoader } from '@elrondnetwork/dapp-core/UI/Loader';

import styles from './styles.module.scss';

export const Loader = () => (
  <div className={styles.loader}>
    <SendLoader />
  </div>
);
