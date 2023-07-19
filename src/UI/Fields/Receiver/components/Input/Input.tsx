import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { ValuesEnum } from 'types';
import styles from '../../styles.module.scss';

export const Input: typeof components.Input = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;

  return (
    <components.Input
      {...props}
      data-testid={ValuesEnum.receiver}
      className={classNames(styles.receiverSelectInput, {
        [styles.visible]: menuIsOpen
      })}
    />
  );
};
