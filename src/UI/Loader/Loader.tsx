import * as React from 'react';
import { PageState } from '@elrondnetwork/dapp-core/UI';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import classNames from 'classnames';

import styles from './styles.module.scss';

const Loader = () => (
  <PageState
    title='Loading...'
    icon={faSpinner}
    iconClass={classNames(styles.icon, 'fa-spin')}
    iconSize='5x'
    dataTestId='loader'
    className={styles.loader}
  />
);

export { Loader };
