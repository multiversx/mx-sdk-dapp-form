import React, { useMemo } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { components } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { filterOptions } from '../../helpers';

import { GenericOptionType } from '../../Receiver.types';
import styles from '../../styles.module.scss';

export const DropdownIndicator: typeof components.DropdownIndicator = (
  props
) => {
  const { selectProps, isDisabled, options } = props;
  const { menuIsOpen, value, isLoading } = selectProps;

  /*
   * Check if the running search query is returning any options.
   */

  const optionsAvailable = useMemo(
    () =>
      options.find((item) => {
        const option = item as FilterOptionOption<GenericOptionType>;
        const search = value as GenericOptionType;

        if (!search) {
          return null;
        }

        return filterOptions(option, search.label);
      }),
    [value, options]
  );

  /*
   * Hide the indicator if the field is disabled, or if there's a search query but without results.
   */

  const noOptionsAvailable = options.length === 0 && !isLoading;
  const noOptionsFound = Boolean(value) && !optionsAvailable;
  const isHidden = isDisabled || noOptionsAvailable || noOptionsFound;

  if (isLoading) {
    return (
      <FontAwesomeIcon
        icon={faSpinner}
        spin={true}
        className={styles.receiverSelectSpinner}
      />
    );
  }

  return (
    <components.DropdownIndicator
      {...props}
      className={classNames(styles.receiverSelectIndicatorContainer, {
        [styles.expanded]: menuIsOpen,
        [styles.hidden]: isHidden
      })}
    />
  );
};
