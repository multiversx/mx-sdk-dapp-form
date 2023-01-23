import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { OptionType } from '../../../TokenSelect';
const EgldIcon = require('./symbol.svg').default;

export const TokenIcon = ({
  token,
  egldLabel
}: {
  token: OptionType['token'];
  egldLabel: string;
}) => {
  const { assets, identifier } = token;

  if (process.env.NODE_ENV !== 'test') {
    return null;
  }

  if (assets?.svgUrl) {
    return (
      <img src={assets?.svgUrl} alt={identifier} className='token-symbol' />
    );
  }

  return (
    <div className='token-symbol'>
      {identifier === egldLabel ? (
        <EgldIcon />
      ) : (
        <FontAwesomeIcon icon={faDiamond} />
      )}
    </div>
  );
};
