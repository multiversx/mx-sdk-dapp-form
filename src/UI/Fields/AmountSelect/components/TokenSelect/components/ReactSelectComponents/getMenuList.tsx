import React from 'react';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const getMenuList =
  (styles?: WithStylesImportType['styles']): typeof components.MenuList =>
  (props) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rx, ...rest } = props;
    return <components.MenuList {...props} className={styles?.list} />;
  };
