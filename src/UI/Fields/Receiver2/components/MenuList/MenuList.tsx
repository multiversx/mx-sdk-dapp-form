import React, { Fragment } from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import { components } from 'react-select';

import styles from '../../styles.module.scss';

import type { GenericOptionType } from '../../types';

export const MenuList: typeof components.MenuList = (props) => {
  const { selectProps, focusedOption } = props;
  const { value, inputValue } = selectProps;

  const focused = focusedOption as GenericOptionType;
  const haystack = focused ? focused.label.toLowerCase() : null;

  const showSuggestion =
    haystack && (!value || (value && inputValue))
      ? haystack.startsWith(inputValue.toLowerCase())
      : false;

  const trimSuggestion =
    showSuggestion && focused
      ? focused.label.replace(
          focused.label.substring(0, inputValue.length),
          inputValue
        )
      : null;

  return (
    <Fragment>
      {trimSuggestion && focused && (
        <Trim
          text={trimSuggestion}
          className={styles.receiverSelectAutocomplete}
        />
      )}

      <components.MenuList {...props} className={styles.receiverSelectList} />
    </Fragment>
  );
};
