import React from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const Option: typeof components.Option = (props) => {
  const { isFocused, data } = props;
  const option = data as GenericOptionType;

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
