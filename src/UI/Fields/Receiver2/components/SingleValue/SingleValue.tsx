import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className={styles.receiverSelectSingle} />
);
