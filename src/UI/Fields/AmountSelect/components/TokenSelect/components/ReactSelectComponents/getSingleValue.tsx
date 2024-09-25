import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

import type { OptionType, TokenSelectPropsType } from '../../tokenSelect.types';

export const getSingleValue =
  (
    TokenTickerIcon?: TokenSelectPropsType['TokenTickerIcon'],
    styles?: WithStylesImportType['styles']
  ): typeof components.SingleValue =>
  (props) => {
    const { selectProps, children } = props;

    const token = selectProps.value as unknown as OptionType;

    return (
      <components.SingleValue
        {...props}
        className={classNames(styles?.single, {
          [styles?.focused]: props.selectProps.menuIsOpen
        })}
      >
        <div className={styles?.ticker}>
          {children}
          {TokenTickerIcon && <TokenTickerIcon token={token?.token} />}
        </div>
      </components.SingleValue>
    );
  };
