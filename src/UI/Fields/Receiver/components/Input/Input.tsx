import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const Input: typeof components.Input = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;

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
