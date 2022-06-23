import React, { useEffect, useState } from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import { Denominate } from '@elrondnetwork/dapp-core/UI';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { scamFlag } from 'helpers';
import { NftEnumType, NftType, TokenType } from 'types';
import { ReactComponent as ElrondSymbol } from './symbol.svg';

export default function TokenElement({
  inDropdown = false,
  isEgld,
  nftType,
  nftTokenDetails,
  token
}: {
  token: TokenType;
  inDropdown?: boolean;
  isEgld?: boolean;
  nftType?: NftEnumType;
  nftTokenDetails?: NftType;
}) {
  const { name, identifier, balance, decimals } = token;
  const avatar = token.assets?.svgUrl || token.assets?.pngUrl || '';
  const avatarDropdownClass = avatar ? 'mr-1' : '';
  const avatarDropdownSize = avatar ? 28 : 20;
  const [title, setTitle] = useState(name);

  useEffect(() => {
    const isScam = nftTokenDetails?.uris?.some((uri) => {
      const link = Buffer.from(String(uri), 'base64').toString();
      const { found } = scamFlag(link, nftTokenDetails?.scamInfo);
      return found;
    });
    if (!isScam) {
      setTitle(name);
    }
  }, [name]);

  let symbol = <FontAwesomeIcon icon={faDiamond} />;
  if (nftType === NftEnumType.NonFungibleESDT) {
    symbol = (
      <div className='nft-type' data-testid={`${identifier}-type-nft`}>
        NFT
      </div>
    );
  }
  if (nftType === NftEnumType.SemiFungibleESDT) {
    symbol = (
      <div className='nft-type' data-testid={`${identifier}-type-sft`}>
        SFT
      </div>
    );
  }

  return (
    <div className='d-flex align-items-center token-element h-100'>
      <div className={inDropdown ? 'mr-1' : 'mr-2'}>
        {isEgld || avatar ? (
          <ElrondSymbol
            className={`${isEgld ? 'elrond-symbol' : 'rounded-circle'} ${
              inDropdown ? avatarDropdownClass : 'mr-2'
            }`}
            height={inDropdown ? avatarDropdownSize : 42}
          />
        ) : (
          <div
            className={
              inDropdown
                ? 'px-2 dropdown-token-icon'
                : 'token-icon mr-2 d-none d-sm-block'
            }
          >
            {symbol}
          </div>
        )}
      </div>
      <div
        className={`${inDropdown ? 'token-text' : 'd-flex flex-column'}`}
        data-testid='tokenName'
      >
        <span data-testid={`${identifier}-element`}>
          <span className='token-name'>{title}</span>{' '}
          {inDropdown ? (
            <span className='token-identifier'>{identifier}</span>
          ) : (
            <div className='token-identifier'>
              <small>{identifier}</small>
            </div>
          )}
        </span>

        {!inDropdown && nftType !== NftEnumType.NonFungibleESDT && (
          <Denominate
            egldLabel={identifier}
            value={balance || '0'}
            decimals={
              nftType === NftEnumType.SemiFungibleESDT ? 0 : constants.decimals
            }
            token={identifier}
            showLabel={false}
            denomination={decimals}
            data-testid={`${identifier}-balance`}
          />
        )}
      </div>
    </div>
  );
}
