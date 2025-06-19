import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import { Trim } from 'UI';

import { HighlightText } from 'UI/HighlightText';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';
import { MultiversXIconSimple } from '../MultiversXIconSimple';

export const Option: typeof components.Option = (props) => {
  const { isFocused, data, selectProps } = props;
  const { inputValue } = selectProps;

  const option = data as GenericOptionType;
  const hasUsername = option.value !== option.label;

  return (
    <components.Option
      {...props}
      className={classNames(styles.receiverSelectOption, {
        [styles.focused]: isFocused
      })}
    >
      {hasUsername ? (
        <>
          <span className={styles.receiverSelectOptionUsername}>
            <MultiversXIconSimple
              className={styles.receiverSelectOptionUsernameIcon}
            />

            <HighlightText text={option.label} highlight={inputValue} />
          </span>

          <span className={styles.receiverSelectOptionNameWrapper}>
            (
            <Trim
              text={option.value}
              className={styles.receiverSelectOptionName}
            />
            )
          </span>
        </>
      ) : (
        <Trim text={option.value} className={styles.receiverSelectOptionName} />
      )}
    </components.Option>
  );
};
