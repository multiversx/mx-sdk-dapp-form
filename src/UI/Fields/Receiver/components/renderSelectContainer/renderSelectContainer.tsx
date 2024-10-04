import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const renderSelectContainer =
  (
    styles?: WithStylesImportType['styles']
  ): typeof components.SelectContainer =>
  (props) => {
    const { selectProps, isFocused, className } = props;
    const { menuIsOpen } = selectProps;

    return (
      <components.SelectContainer
        {...props}
        className={classNames(className, {
          [styles?.expanded]: menuIsOpen,
          [styles?.focused]: isFocused && menuIsOpen
        })}
      />
    );
  };
