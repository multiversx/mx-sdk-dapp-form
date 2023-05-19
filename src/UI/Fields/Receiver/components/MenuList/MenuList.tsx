import React, { Fragment } from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const MenuList: typeof components.MenuList = (props) => {
  const { selectProps, focusedOption } = props;
  const { value, inputValue } = selectProps;

  const focused = focusedOption as GenericOptionType;
  const searchableLabel = focused ? focused.label.toLowerCase() : null;

  const hasInputValue = !value || (value && inputValue);
  const showSuggestion =
    searchableLabel && hasInputValue
      ? searchableLabel.startsWith(inputValue.toLowerCase())
      : false;

  const trimSuggestion =
    showSuggestion && focused
      ? focused.label.replace(
          focused.label.substring(0, inputValue.length),
          inputValue
        )
      : null;

  const showTrimmedAutocomplete = trimSuggestion && !inputValue;
  const showUntrimmedAutocomplete =
    trimSuggestion &&
    Boolean(inputValue) &&
    inputValue.length < trimSuggestion.length / 2;

  return (
    <Fragment>
      {showUntrimmedAutocomplete && (
        <div
          className={classNames(
            styles.receiverSelectAutocomplete,
            styles.receiverSelectAutocompleteUntrimmed
          )}
        >
          {trimSuggestion}
        </div>
      )}

      {showTrimmedAutocomplete && (
        <Trim
          text={trimSuggestion}
          className={styles.receiverSelectAutocomplete}
        />
      )}

      <components.MenuList {...props} className={styles.receiverSelectList} />
    </Fragment>
  );
};
