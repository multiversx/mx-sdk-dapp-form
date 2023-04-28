import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

/*
 * Handle the component declaration.
 */

export const Input: typeof components.Input = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;

  /*
   * Return the component.
   */

  return (
    <components.Input
      {...props}
      data-testid='receiver'
      className={classNames(styles.receiverSelectInput, {
        [styles.visible]: menuIsOpen
      })}
    />
  );
};
