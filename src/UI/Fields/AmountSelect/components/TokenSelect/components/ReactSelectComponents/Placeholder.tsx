import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import styles from './../../tokenSelect.module.scss';

export const Placeholder: typeof components.Placeholder = (props) => (
  <components.Placeholder
    {...props}
    className={classNames(styles.placeholder, {
      [styles.focused]: props.isFocused
    })}
  />
);
