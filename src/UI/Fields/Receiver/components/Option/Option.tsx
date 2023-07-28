import React, { Fragment } from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { HighlightText } from 'UI/Fields/AmountSelect/components/TokenSelect/components';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';
import { MultiversXIconSimple } from '../MultiversXIconSimple';

export const Option: typeof components.Option = (props) => {
  const { isFocused, data, selectProps } = props;
  const { inputValue } = selectProps;

  const option = data as GenericOptionType;
  const hasUsername = option.value !== option.label;
  const username = HighlightText(option.label, inputValue);

  return (
    <components.Option
      {...props}
      className={classNames(styles.receiverSelectOption, {
        [styles.focused]: isFocused
      })}
    >
      {hasUsername ? (
        <Fragment>
          <span className={styles.receiverSelectOptionUsername}>
            <MultiversXIconSimple
              className={styles.receiverSelectOptionUsernameIcon}
            />

            {username}
          </span>

          <span className={styles.receiverSelectOptionNameWrapper}>
            (
            <Trim
              text={option.value}
              className={styles.receiverSelectOptionName}
            />
            )
          </span>
        </Fragment>
      ) : (
        <Trim text={option.value} className={styles.receiverSelectOptionName} />
      )}
    </components.Option>
  );
};
