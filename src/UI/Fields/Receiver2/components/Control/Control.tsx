import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

import type { SelectPropsType } from '../../types';

export const renderControl =
  (isInvalid: SelectPropsType['isInvalid']): typeof components.Control =>
  (props) => {
    const { isFocused, menuIsOpen } = props;

    return (
      <components.Control
        {...props}
        className={classNames(styles.receiverSelectControl, {
          [styles.focused]: isFocused && menuIsOpen,
          [styles.invalid]: isInvalid
        })}
      />
    );
  };
