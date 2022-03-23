import React from 'react';
import classNames from 'classnames';
import { NftEnumType, NftType } from 'types';
import TokenElement from 'UI/Fields/SelectToken/TokenElement';

export interface TokenPropsType {
  tokenId: string;
  egldLabel: string;
  tokenAvatar?: string;
  isEsdtTransaction: boolean;
  tokenIdError?: string;
  nft?: NftType;
}

const Token = ({
  nft,
  isEsdtTransaction,
  tokenId,
  egldLabel,
  tokenAvatar,
  tokenIdError
}: TokenPropsType) => {
  const tokenLabel = nft?.name || '';

  const isNft = nft?.type === NftEnumType.NonFungibleESDT;

  return (
    <div className='form-group token-confirm'>
      <span className='form-label d-block'>
        {nft ? <span>{nft?.name} </span> : ''}
        Token
      </span>
      <div className={classNames('', { 'token-container': isNft })}>
        {nft ? (
          <TokenElement
            inDropdown
            token={{
              name: nft?.identifier,
              identifier: nft?.identifier,
              decimals: 0,
              balance: '0',
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
              balance: '0',
              ticker: '',
              assets: {
                svgUrl: tokenAvatar || ''
              }
            }}
            isEgld={tokenId === egldLabel}
          />
        )}
      </div>
      {tokenIdError && <div className='text-danger'>{tokenIdError}</div>}
    </div>
  );
};

export default Token;
