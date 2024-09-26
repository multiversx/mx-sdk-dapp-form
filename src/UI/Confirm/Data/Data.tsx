import React from 'react';
import { decodePart } from '@multiversx/sdk-dapp/utils/decoders/decodePart';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';

const allOccurences = (sourceStr: string, searchStr: string) =>
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

export interface DataPropsType {
  label?: string;
  scCallLabel?: string;
  data: string;
  highlight?: string;
  isScCall?: boolean;
}

export const DataComponent = ({
  label = 'Data',
  scCallLabel = 'SC Call',
  data,
  highlight,
  isScCall,
  globalStyles,
  styles
}: DataPropsType & WithStylesImportType) => {
  let output = <>{data}</>;

  const [encodedScCall, ...remainingDataFields] =
    highlight && isScCall ? highlight.split('@') : [];

  if (data && highlight && allOccurences(data, highlight).length === 1) {
    switch (true) {
      case data.startsWith(highlight): {
        const [, rest] = data.split(highlight);
        output = (
          <>
            {highlight}
            <span>{rest}</span>
          </>
        );
        break;
      }
      case data.endsWith(highlight): {
        const [rest] = data.split(highlight);
        output = (
          <>
            <span>{rest}</span>
            {highlight}
          </>
        );
        break;
      }

      default: {
        const [start, end] = data.split(highlight);

        output = (
          <>
            <span>{start}</span>
            {highlight}
            <span>{end}</span>
          </>
        );
        break;
      }
    }
  }

  return (
    <>
      {encodedScCall && (
        <div className={styles?.data}>
          <span className={globalStyles?.label}>{scCallLabel}</span>

          <div
            data-testid={FormDataTestIdsEnum.confirmScCall}
            className={styles?.value}
          >
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}

      <div className={styles?.data}>
        <span className={globalStyles?.label}>{label}</span>

        <div
          data-testid={FormDataTestIdsEnum.confirmData}
          className={styles?.value}
        >
          {data ? output : 'N/A'}
        </div>
      </div>
    </>
  );
};

export const Data = withStyles(DataComponent, {
  ssrStyles: () => import('UI/Confirm/Data/styles.module.scss'),
  clientStyles: () => require('UI/Confirm/Data/styles.module.scss').default
});
