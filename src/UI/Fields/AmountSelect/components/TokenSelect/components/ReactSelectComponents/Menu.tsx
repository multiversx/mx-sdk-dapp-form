import React from 'react';
import { components } from 'react-select';
import styles from './../../tokenSelect.module.scss';

export const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu} />
);
