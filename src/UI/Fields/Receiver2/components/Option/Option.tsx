import React from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

import type { GenericOptionType } from '../../types';

// import { HighlightText } from '../HighlightText';

export const Option: typeof components.Option = (props) => {
  const { isFocused, data /* selectProps */ } = props;
  // const { inputValue } = selectProps;
  const option = data as GenericOptionType;

  // const [label, value] = [option.label, option.value].map((item) =>
  //   Boolean(inputValue) ? HighlightText(item, inputValue) : item
  // );

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
