import React, { useEffect, useState } from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import { Denominate } from '@elrondnetwork/dapp-core/UI';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { scamFlag } from 'helpers';
import { NftEnumType, NftType, TokenType } from 'types';

import styles from './styles.module.scss';
import ElrondSymbol from './symbol.svg';

const TokenElement = ({
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
}) => {
  const { name, identifier, balance, decimals } = token;
  const avatar = token.assets?.svgUrl || token.assets?.pngUrl || '';
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
  if (nftType == NftEnumType.NonFungibleESDT) {
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
    <div className={styles.token}>
      <div className={styles.wrapper}>
        {isEgld || avatar ? (
          <ElrondSymbol
            height={avatarDropdownSize}
            className={classNames({
              [styles.spaced]: Boolean(avatar),
              [styles.circle]: !isEgld
            })}
          />
        ) : (
          <div className={styles.symbol}>{symbol}</div>
        )}
      </div>

      <div data-testid='tokenName'>
        <span data-testid={`${identifier}-element`}>
          <span>{title}</span>{' '}
          <span className={styles.identifier}>{identifier}</span>
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
};

export default TokenElement;
