import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FilterOptionOption, components } from 'react-select';
import { MvxSpinnerIcon } from 'UI/sdkDappUi';

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
    return <MvxSpinnerIcon class={styles.receiverSelectSpinner} />;
  }

  return (
    <components.DropdownIndicator
      {...props}
      className={classNames(styles.receiverSelectIndicator, {
        [styles.expanded]: menuIsOpen,
        [styles.hidden]: isHidden
      })}
    />
  );
};
