import React from 'react';
import { decodePart } from '@multiversx/sdk-dapp/utils/decoders/decodePart';

import globals from 'assets/sass/globals.module.scss';

import { FormTestIdsEnum } from 'constants/dataTestIds';
import styles from './styles.module.scss';

const allOccurences = (sourceStr: string, searchStr: string) =>
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

export interface DataPropsType {
  label?: string;
  scCallLabel?: string;
  data: string;
  highlight?: string;
  isScCall?: boolean;
}

export const Data = ({
  label = 'Data',
  scCallLabel = 'SC Call',
  data,
  highlight,
  isScCall
}: DataPropsType) => {
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
        <div className={styles.data}>
          <span className={globals.label}>{scCallLabel}</span>

          <div
            data-testid={FormTestIdsEnum.confirmScCall}
            className={styles.value}
          >
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}

      <div className={styles.data}>
        <span className={globals.label}>{label}</span>

        <div data-testid={FormTestIdsEnum.confirmData} className={styles.value}>
          {data ? output : 'N/A'}
        </div>
      </div>
    </>
  );
};
