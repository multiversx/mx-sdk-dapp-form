import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import styles from './../../tokenSelect.module.scss';

export const IndicatorsContainer: typeof components.IndicatorsContainer = (
  props
) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames(styles.indicator, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);
