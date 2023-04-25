import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

export const DropdownIndicator: typeof components.DropdownIndicator = (
  props
) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;

  return (
    <components.DropdownIndicator
      {...props}
      className={classNames(styles.receiverSelectIndicator, {
        [styles.expanded]: menuIsOpen
      })}
    />
  );
};
