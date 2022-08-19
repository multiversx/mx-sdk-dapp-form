import React from 'react';

import globals from 'assets/sass/globals.module.scss';
import { ZERO } from 'constants/index';
import { NftType } from 'types';
import { TokenElement } from 'UI/Fields/SelectToken/TokenElement';

import styles from './styles.module.scss';

export interface TokenPropsType {
  tokenId: string;
  egldLabel: string;
  tokenAvatar?: string;
  isEsdtTransaction: boolean;
  tokenIdError?: string;
  nft?: NftType;
}

export const Token = ({
  nft,
  isEsdtTransaction,
  tokenId,
  egldLabel,
  tokenAvatar,
  tokenIdError
}: TokenPropsType) => {
  const tokenLabel = nft?.name || '';

  return (
    <div className={styles.token}>
      <span className={styles.label}>
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
              name: isEsdtTransaction ? tokenLabel : 'Elrond eGold',
              identifier: isEsdtTransaction ? tokenId : egldLabel,
              decimals: 0,
              balance: ZERO,
              ticker: '',
              assets: {
                svgUrl: tokenAvatar || ''
              }
            }}
            isEgld={tokenId === egldLabel}
          />
        )}
      </div>

      {tokenIdError && <div className={globals.error}>{tokenIdError}</div>}
    </div>
  );
};
