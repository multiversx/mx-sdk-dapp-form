import React from 'react';
import { components } from 'react-select';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';

import { WithStylesImportType } from 'hocs/withStyles';

export const getInput =
  (styles?: WithStylesImportType['styles']): typeof components.Input =>
  (props) => {
    return (
      <components.Input
        {...props}
        data-testid={FormDataTestIdsEnum.tokenSelectInput}
        className={styles?.input}
      />
    );
  };
