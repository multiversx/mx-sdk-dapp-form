import React from 'react';
import { components } from 'react-select';

import styles from './../../tokenSelect.module.scss';

export const Control: typeof components.Control = (props) => (
  <components.Control {...props} className={styles.control} />
);
