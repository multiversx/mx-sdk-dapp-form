import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import { Trim } from 'UI';
import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';
import { MultiversXIconSimple } from '../MultiversXIconSimple';

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

  const inputExceedsHalfSuggestion =
    trimSuggestion && inputValue.length < trimSuggestion.length / 2;

  const showAddressUntrimmedAutocomplete =
    trimSuggestion && Boolean(inputValue) && inputExceedsHalfSuggestion;

  const showUsernameUntrimmedAutocomplete =
    trimSuggestion && Boolean(inputValue);

  return (
    <>
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
          {hasUsername ? (
            <>
              <span>
                <MultiversXIconSimple
                  className={classNames(
                    styles.receiverSelectAutocompleteIcon,
                    styles.receiverSelectAutocompleteIconMuted
                  )}
                />

                {focused.label}
              </span>

              <span className={styles.receiverSelectAutocompleteWrapper}>
                (<Trim text={focused.value} />)
              </span>
            </>
          ) : (
            <Trim text={trimSuggestion} />
          )}
        </span>
      )}

      <components.MenuList {...props} className={styles.receiverSelectList} />
    </>
  );
};
