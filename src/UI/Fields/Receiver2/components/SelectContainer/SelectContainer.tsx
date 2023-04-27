import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const SelectContainer: typeof components.SelectContainer = (props) => {
  const { selectProps, isFocused, className } = props;
  const { menuIsOpen } = selectProps;

  return (
    <components.SelectContainer
      {...props}
      className={classNames(className, {
        [styles.expanded]: menuIsOpen,
        [styles.focused]: isFocused && menuIsOpen
      })}
    />
  );
};
