import React from 'react';
import { Loader } from '@elrondnetwork/dapp-core/UI/Loader';

import styles from './styles.module.scss';

export const SendLoader = () => (
  <div className={styles.loader}>
    <Loader />
  </div>
);
