import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const ValueContainer: typeof components.ValueContainer = (props) => (
  <components.ValueContainer
    {...props}
    className={styles.receiverSelectValue}
  />
);
