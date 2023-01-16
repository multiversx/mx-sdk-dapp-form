import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { useNetworkConfigContext, useSendFormContext } from 'contexts';
const EgldIcon = require('./symbol.svg').default;

export const TokenIcon = () => {
  const { tokensInfo } = useSendFormContext();

  const { tokenDetails } = tokensInfo;

  const { assets, identifier } = tokenDetails;

  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();

  return process.env.NODE_ENV !== 'test' ? (
    <>
      {assets?.svgUrl ? (
        <img src={assets?.svgUrl} alt={identifier} className='token-symbol' />
      ) : (
        <div className='token-symbol'>
          {identifier === egldLabel ? (
            <EgldIcon />
          ) : (
            <FontAwesomeIcon icon={faDiamond} />
          )}
        </div>
      )}
    </>
  ) : null;
};
