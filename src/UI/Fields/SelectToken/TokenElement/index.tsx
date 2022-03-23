import React from 'react';
import { switchTrue, DappUI } from '@elrondnetwork/dapp-core';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ElrondSymbol from 'assets/img/symbol.svg';
import { decimals } from 'constants/index';
import { scamFlag } from 'helpers';
import { NftEnumType, NftType, TokenType } from 'types';

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
  const { name, identifier, balance, decimals: denomination } = token;
  const avatar = token.assets?.svgUrl || token.assets?.pngUrl || '';
  const avatarDropdownClass = avatar ? 'mr-1' : '';
  const avatarDropdownSize = avatar ? 28 : 20;
  const [title, setTitle] = React.useState(name);

  React.useEffect(() => {
    const isScam = nftTokenDetails?.uris?.some((uri) => {
      const link = Buffer.from(String(uri), 'base64').toString();
      const { found } = scamFlag(link, nftTokenDetails?.scamInfo);
      return found;
    });
    if (!isScam) {
      setTitle(name);
    }
  }, [name]);

  // TODO redo
  const symbol = switchTrue({
    [`${nftType === NftEnumType.NonFungibleESDT}`]: (
      <div className='nft-type' data-testid={`${identifier}-type-nft`}>
        NFT
      </div>
    ),
    [`${nftType === NftEnumType.SemiFungibleESDT}`]: (
      <div className='nft-type' data-testid={`${identifier}-type-sft`}>
        SFT
      </div>
    ),
    default: <FontAwesomeIcon icon={faDiamond} />
  });

  return (
    <div className='d-flex align-items-center token-element h-100'>
      <div className={inDropdown ? 'mr-1' : 'mr-2'}>
        {isEgld || avatar ? (
          <img
            className={`${isEgld ? 'elrond-symbol' : 'rounded-circle'} ${
              inDropdown ? avatarDropdownClass : 'mr-2'
            }`}
            src={isEgld ? ElrondSymbol : avatar}
            alt={name}
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
          <DappUI.Denominate
            value={balance || '0'}
            decimals={nftType === NftEnumType.SemiFungibleESDT ? 0 : decimals}
            token={identifier}
            showLabel={false}
            denomination={denomination}
            data-testid={`${identifier}-balance`}
          />
        )}
      </div>
    </div>
  );
}
