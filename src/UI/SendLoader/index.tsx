import React from 'react';
import { PageState } from '@elrondnetwork/dapp-core/UI/PageState';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import styles from './styles.module.scss';

export const SendLoader = ({ title = 'Loading...' }: { title?: string }) => (
  <div className={styles.loader}>
    <PageState
      title={title}
      iconClass={classNames(styles.icon, 'fa-spin')}
      icon={faSpinner}
    />
  </div>
);

export default SendLoader;
