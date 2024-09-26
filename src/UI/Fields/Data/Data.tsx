import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ValuesEnum } from 'types';

import { AdvancedMode } from './components';
import { useIsDataDisabled } from './hooks';

export const DataComponent = ({
  className,
  styles,
  globalStyles
}: WithClassnameType & WithStylesImportType) => {
  const {
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const isDisabled = useIsDataDisabled();

  return (
    <div className={classNames(styles?.data, className)}>
      <div className={styles?.label}>
        <label htmlFor={ValuesEnum.data} className={globalStyles?.label}>
          Data
        </label>
        <AdvancedMode />
      </div>
      <div className={styles?.wrapper}>
        <textarea
          rows={1}
          id={ValuesEnum.data}
          name={ValuesEnum.data}
          disabled={isDisabled}
          data-testid={ValuesEnum.data}
          value={data}
          onBlur={onBlur}
          onChange={onChange}
          spellCheck='false'
          placeholder='Add transaction data'
          className={classNames(globalStyles?.textarea, {
            [globalStyles?.invalid]: isDataInvalid,
            [globalStyles?.disabled]: isDisabled
          })}
        />
      </div>
      {isDataInvalid && (
        <div
          className={globalStyles?.error}
          data-testid={FormDataTestIdsEnum.dataError}
        >
          {dataError}
        </div>
      )}
    </div>
  );
};

export const Data = withStyles(DataComponent, {
  ssrStyles: () => import('UI/Fields/Data/styles.module.scss'),
  clientStyles: () => require('UI/Fields/Data/styles.module.scss').default
});
