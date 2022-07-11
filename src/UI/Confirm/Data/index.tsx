import React from 'react';
import { decodePart } from '@elrondnetwork/dapp-core/utils/decoders/decodePart';

const allOccurences = (sourceStr: string, searchStr: string) =>
  // eslint-disable-next-line
  // @ts-ignore
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

const Data = ({
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
  let output = <React.Fragment>{data}</React.Fragment>;

  const [encodedScCall, ...remainingDataFields] =
    highlight && isScCall ? highlight.split('@') : [];

  if (data && highlight && allOccurences(data, highlight).length === 1) {
    switch (true) {
      case data.startsWith(highlight): {
        const [, rest] = data.split(highlight);
        output = (
          <React.Fragment>
            {highlight}
            <span className='text-muted'>{rest}</span>
          </React.Fragment>
        );
        break;
      }
      case data.endsWith(highlight): {
        const [rest] = data.split(highlight);
        output = (
          <React.Fragment>
            <span className='text-muted'>{rest}</span>
            {highlight}
          </React.Fragment>
        );
        break;
      }

      default: {
        const [start, end] = data.split(highlight);

        output = (
          <React.Fragment>
            <span className='text-muted'>{start}</span>
            {highlight}
            <span className='text-muted'>{end}</span>
          </React.Fragment>
        );
        break;
      }
    }
  }

  return (
    <React.Fragment>
      {encodedScCall && (
        <div className='form-group mb-0 data-field mw-100'>
          <span className='form-label text-secondary d-block'>
            {scCallLabel}
          </span>

          <div
            data-testid='confirmScCall'
            className='textarea form-control cursor-text mt-1 text-break-all'
          >
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}
      <div className='form-group mb-0 data-field mw-100'>
        <span className='form-label text-secondary d-block'>{label}</span>

        <div
          data-testid='confirmData'
          className='textarea form-control cursor-text mt-1 text-break-all'
        >
          {data ? output : 'N/A'}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Data;
