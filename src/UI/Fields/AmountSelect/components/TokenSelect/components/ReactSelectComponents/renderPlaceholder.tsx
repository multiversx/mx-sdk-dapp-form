import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const renderPlaceholder =
  (styles?: WithStylesImportType['styles']): typeof components.Placeholder =>
  (props) => {
    return (
      <components.Placeholder
        {...props}
        className={classNames(styles?.placeholder, {
          [styles?.focused]: props.isFocused
        })}
      />
    );
  };
