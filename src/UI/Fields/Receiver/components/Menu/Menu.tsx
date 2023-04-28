import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

/*
 * Handle the component declaration.
 */

export const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.receiverSelectMenu} />
);
