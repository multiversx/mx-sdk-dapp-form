import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

/*
 * Handle the component declaration.
 */

export const SelectContainer: typeof components.SelectContainer = (props) => {
  const { selectProps, isFocused, className } = props;
  const { menuIsOpen } = selectProps;

  /*
   * Return the component.
   */

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
