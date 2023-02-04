import React from 'react';
import { components } from 'react-select';
import styles from './../../tokenSelect.module.scss';

export const MenuList: typeof components.MenuList = (props) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rx, ...rest } = props;
  return <components.MenuList {...rest} className={styles.list} />;
};
