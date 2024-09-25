import React from 'react';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const getControl =
  (styles?: WithStylesImportType['styles']): typeof components.Control =>
  (props) => {
    return <components.Control {...props} className={styles?.control} />;
  };
