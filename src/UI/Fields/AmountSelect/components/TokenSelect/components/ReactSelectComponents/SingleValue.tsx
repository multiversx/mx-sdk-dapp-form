import React from 'react';
import { components } from 'react-select';
import classNames from 'classnames';

import styles from './../../tokenSelect.module.scss';

export const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue
    {...props}
    className={classNames(styles.single, {
      [styles.focused]: props.selectProps.menuIsOpen
    })}
  />
);
