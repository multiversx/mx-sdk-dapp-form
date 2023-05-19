import React from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const ValueContainer: typeof components.ValueContainer = (props) => {
  const { selectProps, isDisabled } = props;
  const { value, menuIsOpen } = selectProps;
  const option = value as GenericOptionType;

  return (
    <components.ValueContainer
      {...props}
      className={styles.receiverSelectValue}
    >
      {!menuIsOpen && option && (
        <Trim
          text={option.value}
          className={classNames(styles.receiverSelectSingle, {
            [styles.disabled]: isDisabled
          })}
        />
      )}

      {props.children}
    </components.ValueContainer>
  );
};
