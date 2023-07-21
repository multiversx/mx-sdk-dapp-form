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
  const hasUsername = option && option.label !== option.value;

  return (
    <components.ValueContainer
      {...props}
      className={styles.receiverSelectValue}
    >
      {!menuIsOpen && option && (
        <span
          className={classNames(styles.receiverSelectSingle, {
            [styles.disabled]: isDisabled
          })}
        >
          {hasUsername && <span>{option.label}</span>}

          {hasUsername ? (
            <span className={styles.receiverSelectSingleTrimWrapper}>
              (
              <Trim
                text={option.value}
                className={styles.receiverSelectSingleTrim}
              />
              )
            </span>
          ) : (
            <Trim
              text={option.value}
              className={styles.receiverSelectSingleTrimWrapper}
            />
          )}
        </span>
      )}

      {props.children}
    </components.ValueContainer>
  );
};
