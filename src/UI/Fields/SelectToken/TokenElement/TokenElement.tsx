import React, { useEffect, useState } from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { ZERO } from 'constants/index';
import { scamFlag } from 'helpers';
import { NftEnumType, NftType, TokenType } from 'types';

import styles from './styles.module.scss';
import ElrondSymbol from './symbol.svg';

export const TokenElement = ({
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

  const showDenomination =
    !inDropdown && nftType !== NftEnumType.NonFungibleESDT;

  return (
    <div className={styles.tokenElement}>
      <div className={styles.tokenElementWrapper}>
        {isEgld || avatar ? (
          <ElrondSymbol
            height={avatarDropdownSize}
            className={classNames({
              [styles.tokenElementSpaced]: Boolean(avatar),
              [styles.tokenElementCircle]: !isEgld
            })}
          />
        ) : (
          <div className={styles.tokenElementSymbol}>{symbol}</div>
        )}
      </div>

      <div data-testid='tokenName'>
        <span data-testid={`${identifier}-element`}>
          <span>{title}</span>{' '}
          <span className={styles.tokenElementIdentifier}>{identifier}</span>
        </span>

        {showDenomination && (
          <Denominate
            egldLabel={identifier}
            value={balance || ZERO}
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
