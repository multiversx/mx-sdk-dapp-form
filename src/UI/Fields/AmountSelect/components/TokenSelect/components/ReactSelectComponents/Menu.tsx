import React from 'react';
import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import styles from './../../tokenSelect.module.scss';

export const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu}>
    {props.selectProps.isLoading ? (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' size='lg' />
      </div>
    ) : (
      props.children
    )}
  </components.Menu>
);
