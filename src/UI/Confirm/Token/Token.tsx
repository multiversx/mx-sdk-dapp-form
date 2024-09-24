import React, { JSXElementConstructor } from 'react';

import globals from 'assets/sass/globals.module.scss';
import { ZERO } from 'constants/index';
import { PartialNftType, WithClassnameType } from 'types';
import { TokenElement } from 'UI/Fields/SelectToken/TokenElement';

import styles from './styles.module.scss';

export interface TokenPropsType extends WithClassnameType {
  EgldIcon?: JSXElementConstructor<any>;
  egldLabel: string;
  isEsdtTransaction: boolean;
  nft?: PartialNftType;
  tokenAvatar?: string;
  tokenId: string;
  tokenIdError?: string;
}

export const Token = ({
  EgldIcon,
  egldLabel,
  isEsdtTransaction,
  nft,
  tokenAvatar,
  tokenId,
  tokenIdError
}: TokenPropsType) => {
  const tokenLabel = nft?.name || '';

  return (
    <div className={styles.token}>
      <span className={globals.label}>
        {nft ? <span>{nft?.name} </span> : ''}
        Token
      </span>

      <div>
        {nft ? (
          <TokenElement
            inDropdown
            token={{
              name: nft?.name,
              identifier: nft?.identifier,
              decimals: 0,
              balance: ZERO,
              ticker: '',
              assets: {
                svgUrl: nft?.assets?.svgUrl || ''
              }
            }}
          />
        ) : (
          <TokenElement
            inDropdown
            token={{
              name: isEsdtTransaction ? tokenLabel : 'MultiversX eGold',
              identifier: isEsdtTransaction ? tokenId : egldLabel,
              decimals: 0,
              balance: ZERO,
              ticker: '',
              assets: {
                svgUrl: tokenAvatar || ''
              }
            }}
            isEgld={tokenId === egldLabel}
            EgldIcon={EgldIcon}
          />
        )}
      </div>

      {tokenIdError && <div className={globals.error}>{tokenIdError}</div>}
    </div>
  );
};
