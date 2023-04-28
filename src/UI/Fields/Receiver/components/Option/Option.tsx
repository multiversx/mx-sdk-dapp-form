import React from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

import type { GenericOptionType } from '../../types';

/*
 * Handle the component declaration.
 */

export const Option: typeof components.Option = (props) => {
  const { isFocused, data } = props;
  const option = data as GenericOptionType;

  /*
   * Return the component.
   */

  return (
    <components.Option
      {...props}
      className={classNames(styles.receiverSelectOption, {
        [styles.focused]: isFocused
      })}
    >
      <Trim text={option.label} className={styles.receiverSelectOptionName} />
    </components.Option>
  );
};
