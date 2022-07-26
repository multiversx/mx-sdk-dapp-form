import React from 'react';
import { decodePart } from '@elrondnetwork/dapp-core/utils';

import globals from 'assets/sass/globals.module.scss';
import styles from './styles.module.scss';

const allOccurences = (sourceStr: string, searchStr: string) =>
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

export const Data = ({
  label = 'Data',
  scCallLabel = 'SC Call',
  data,
  highlight,
  isScCall
}: {
  label?: string;
  scCallLabel?: string;
  data: string;
  highlight?: string;
  isScCall?: boolean;
}) => {
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
            <span className={styles.secondary}>{rest}</span>
          </>
        );
        break;
      }
      case data.endsWith(highlight): {
        const [rest] = data.split(highlight);
        output = (
          <>
            <span className={styles.secondary}>{rest}</span>
            {highlight}
          </>
        );
        break;
      }

      default: {
        const [start, end] = data.split(highlight);

        output = (
          <>
            <span className={styles.secondary}>{start}</span>
            {highlight}
            <span className={styles.secondary}>{end}</span>
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
          <span className={styles.label}>{scCallLabel}</span>

          <div data-testid='confirmScCall' className={globals.textarea}>
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}

      <div className={styles.data}>
        <span className={styles.label}>{label}</span>

        <div data-testid='confirmData' className={globals.textarea}>
          {data ? output : 'N/A'}
        </div>
      </div>
    </>
  );
};
