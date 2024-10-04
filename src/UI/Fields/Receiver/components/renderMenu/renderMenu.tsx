import React from 'react';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const renderMenu =
  (styles?: WithStylesImportType['styles']): typeof components.Menu =>
  (props) => {
    return (
      <components.Menu {...props} className={styles?.receiverSelectMenu} />
    );
  };
