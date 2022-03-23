import React, { useMemo } from 'react';
import { useSendFormContext } from 'contexts';
import { NftEnumType } from 'types';
import TokenElement from 'UI/Fields/SelectToken/TokenElement';

const Token = () => {
  const { formInfo, tokensInfo } = useSendFormContext();
  const { isEsdtTransaction } = formInfo;
  const { tokenId, nft, tokenIdError, egldLabel } = tokensInfo;

  const tokenLabel = nft?.name || '';
  const tokenAvatar = nft?.assets?.svgUrl || '';

  const tokenView = useMemo(() => {
    if (nft) {
      return (
        <TokenElement
          inDropdown
          token={{
            name: nft?.identifier,
            identifier: nft?.identifier,
            decimals: 0,
            balance: '0',
            ticker: '',
            assets: {
              svgUrl: nft?.assets?.svgUrl,
              pngUrl: nft?.assets?.pngUrl
            }
          }}
        />
      );
    }
    return (
      <TokenElement
        inDropdown
        token={{
          name: isEsdtTransaction ? tokenLabel : 'Elrond eGold',
          identifier: isEsdtTransaction ? tokenId : egldLabel,
          decimals: 0,
          balance: '0',
          ticker: '',
          assets: {
            svgUrl: tokenAvatar
          }
        }}
        isEgld={tokenId === egldLabel}
      />
    );
  }, [nft, tokenLabel, tokenId, tokenAvatar, egldLabel, isEsdtTransaction]);

  return (
    <div className='form-group token-confirm'>
      <span className='form-label d-block'>
        {nft ? <span>{nft?.name} </span> : ''}
        Token
      </span>
      <div
        className={
          nft?.type === NftEnumType.NonFungibleESDT ? '' : 'token-container'
        }
      >
        {tokenView}
      </div>
      {tokenIdError && <div className='text-danger'>{tokenIdError}</div>}
    </div>
  );
};

export default Token;
