import React from 'react';
import { PageState } from '@elrondnetwork/dapp-core/UI/PageState';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import styles from './styles.module.scss';

const SendLoader = ({ title = 'Loading...' }: { title?: string }) => (
  <PageState
    title={title}
    iconClass={classNames(styles.icon, 'fa-spin')}
    icon={faSpinner}
    className={styles.loader}
  />
);

export { SendLoader };
