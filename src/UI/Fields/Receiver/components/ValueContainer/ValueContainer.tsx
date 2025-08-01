import React from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import classNames from 'classnames';
import { components } from 'react-select';
import { useSendFormContext } from 'contexts';
import { Trim } from 'UI';
import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';
import MultiversXIconSimple from '../MultiversXIconSimple';

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
    ? { value: receiver ?? option.value, label: option.label }
    : null;

  const shouldShowPreview =
    superOption &&
    (hasUsername || (!hasUsername && !menuIsOpen)) &&
    addressIsValid(superOption.value);

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
          {hasUsername ? (
            <>
              <span className={styles.receiverSelectSingleUsername}>
                <MultiversXIconSimple
                  className={styles.receiverSelectSingleUsernameIcon}
                />

                {superOption.label}
              </span>

              <span className={styles.receiverSelectSingleTrimWrapper}>
                (
                <Trim
                  text={superOption.value}
                  className={styles.receiverSelectSingleTrim}
                />
                )
              </span>
            </>
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
