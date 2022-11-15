import React from 'react';
import { Loader as SendLoader } from '@elrondnetwork/dapp-core/UI/Loader/index';

import styles from './styles.module.scss';

export const Loader = () => (
  <div className={styles.loader}>
    <SendLoader />
  </div>
);
