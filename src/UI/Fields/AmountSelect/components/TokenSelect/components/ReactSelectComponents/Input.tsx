import React from 'react';
import { components } from 'react-select';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import styles from './../../tokenSelect.module.scss';

export const Input: typeof components.Input = (props) => (
  <components.Input
    {...props}
    className={styles.dropdown}
    data-testid={FormDataTestIdsEnum.tokenSelectInput}
  />
);
