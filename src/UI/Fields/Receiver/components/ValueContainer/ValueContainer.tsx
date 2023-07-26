import React from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { useSendFormContext } from 'contexts';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const {
  default: MultiversXIconSimple
} = require('../../../../../assets/icons/mx-icon-simple.svg');

export const ValueContainer: typeof components.ValueContainer = (props) => {
  const { selectProps, isDisabled } = props;
  const { value, menuIsOpen } = selectProps;

  const option = value as GenericOptionType;
  const {
    receiverInfo: { receiver },
    receiverUsernameInfo: { receiverUsername }
  } = useSendFormContext();

  const hasUsername =
    receiverUsername ?? (option && option.value !== option.label);

  const superOption = option
    ? {
        value: receiver ?? option.value,
        label: receiverUsername ?? option.label
      }
    : null;

  const shouldShowPreview =
    superOption && (hasUsername || (!hasUsername && !menuIsOpen));

  return (
    <components.ValueContainer
      {...props}
      className={styles.receiverSelectValue}
    >
      {shouldShowPreview && (
        <span
          className={classNames(styles.receiverSelectSingle, {
            [styles.disabled]: isDisabled
          })}
        >
          {hasUsername && (
            <span className={styles.receiverSelectSingleUsername}>
              <MultiversXIconSimple
                className={styles.receiverSelectSingleUsernameIcon}
              />

              {superOption.label}
            </span>
          )}

          {hasUsername ? (
            <span className={styles.receiverSelectSingleTrimWrapper}>
              (
              <Trim
                text={superOption.value}
                className={styles.receiverSelectSingleTrim}
              />
              )
            </span>
          ) : (
            <Trim
              text={superOption.value}
              className={styles.receiverSelectSingleTrim}
            />
          )}
        </span>
      )}

      {props.children}
    </components.ValueContainer>
  );
};
