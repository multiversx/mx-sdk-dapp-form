import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const Input: typeof components.Input = (props) => (
  <components.Input
    {...props}
    className={styles.receiverSelectInput}
    data-testid='receiver'
  />
);
