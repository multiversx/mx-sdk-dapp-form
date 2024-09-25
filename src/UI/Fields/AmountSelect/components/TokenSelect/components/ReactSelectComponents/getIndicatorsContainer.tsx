import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const getIndicatorsContainer =
  (
    styles?: WithStylesImportType['styles']
  ): typeof components.IndicatorsContainer =>
  (props) => {
    return (
      <components.IndicatorsContainer
        {...props}
        className={classNames(styles?.indicator, {
          [styles?.expanded]: props.selectProps.menuIsOpen
        })}
      />
    );
  };
