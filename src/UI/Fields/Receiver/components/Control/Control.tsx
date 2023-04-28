import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

/*
 * Handle the component declaration.
 */

export const Control: typeof components.Control = (props) => (
  <components.Control {...props} className={styles.receiverSelectControl} />
);
