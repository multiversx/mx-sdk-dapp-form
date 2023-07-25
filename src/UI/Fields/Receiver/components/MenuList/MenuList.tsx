import React, { Fragment } from 'react';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { components } from 'react-select';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const {
  default: MultiversXIconSimple
} = require('../../../../../assets/icons/mx-icon-simple.svg');

export const MenuList: typeof components.MenuList = (props) => {
  const { selectProps, focusedOption } = props;
  const { value, inputValue } = selectProps;

  const focused = focusedOption as GenericOptionType;
  const searchableLabel = focused ? focused.label.toLowerCase() : null;
  const hasUsername = focused && focused.label !== focused.value;

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

  const showAddressUntrimmedAutocomplete =
    trimSuggestion &&
    Boolean(inputValue) &&
    inputValue.length < trimSuggestion.length / 2;

  const showUsernameUntrimmedAutocomplete =
    trimSuggestion && Boolean(inputValue);

  return (
    <Fragment>
      {showAddressUntrimmedAutocomplete && !hasUsername && (
        <div
          className={classNames(
            styles.receiverSelectAutocomplete,
            styles.receiverSelectAutocompleteUntrimmed
          )}
        >
          {trimSuggestion}
        </div>
      )}

      {showUsernameUntrimmedAutocomplete && hasUsername && (
        <div
          className={classNames(
            styles.receiverSelectAutocomplete,
            styles.receiverSelectAutocompleteUsername
          )}
        >
          <MultiversXIconSimple
            className={styles.receiverSelectAutocompleteIcon}
          />

          {trimSuggestion}

          <span className={styles.receiverSelectAutocompleteWrapper}>
            (<Trim text={focused.value} />)
          </span>
        </div>
      )}

      {showTrimmedAutocomplete && (
        <span
          className={classNames(styles.receiverSelectAutocomplete, {
            [styles.receiverSelectAutocompleteUsername]: hasUsername
          })}
        >
          {hasUsername && (
            <span>
              <MultiversXIconSimple
                className={classNames(
                  styles.receiverSelectAutocompleteIcon,
                  styles.receiverSelectAutocompleteIconMuted
                )}
              />

              {focused.label}
            </span>
          )}

          {hasUsername ? (
            <span className={styles.receiverSelectAutocompleteWrapper}>
              (<Trim text={focused.value} />)
            </span>
          ) : (
            <Trim text={trimSuggestion} />
          )}
        </span>
      )}

      <components.MenuList {...props} className={styles.receiverSelectList} />
    </Fragment>
  );
};
