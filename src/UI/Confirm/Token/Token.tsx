import React, { JSXElementConstructor } from 'react';

import { ZERO } from 'constants/index';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { PartialNftType, WithClassnameType } from 'types';
import { TokenElement } from 'UI/Fields/SelectToken/TokenElement';

export interface TokenPropsType extends WithClassnameType {
  EgldIcon?: JSXElementConstructor<any>;
  egldLabel: string;
  isEsdtTransaction: boolean;
  nft?: PartialNftType;
  tokenAvatar?: string;
  tokenId: string;
  tokenIdError?: string;
}

export const TokenComponent = ({
  EgldIcon,
  egldLabel,
  isEsdtTransaction,
  nft,
  tokenAvatar,
  tokenId,
  tokenIdError,
  globalStyles,
  styles
}: TokenPropsType & WithStylesImportType) => {
  const tokenLabel = nft?.name || '';

  return (
    <div className={styles?.token}>
      <span className={globalStyles?.label}>
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

      {tokenIdError && (
        <div className={globalStyles?.error}>{tokenIdError}</div>
      )}
    </div>
  );
};

export const Token = withStyles(TokenComponent, {
  ssrStyles: () => import('UI/Confirm/Token/styles.scss'),
  clientStyles: () => require('UI/Confirm/Token/styles.scss').default
});
