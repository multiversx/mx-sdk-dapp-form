import React from 'react';
import { Loader as SendLoader } from '@multiversx/sdk-dapp/UI/Loader/index';

import styles from './styles.module.scss';

export const Loader = () => (
  <div className={styles.loader}>
    <SendLoader />
  </div>
);
