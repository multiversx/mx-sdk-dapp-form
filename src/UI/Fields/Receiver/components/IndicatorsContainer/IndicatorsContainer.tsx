import React from 'react';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const IndicatorsContainer: typeof components.IndicatorsContainer = (
  props
) => (
  <components.IndicatorsContainer
    {...props}
    className={styles.receiverSelectIndicator}
  />
);
