import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import classNames from 'classnames';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum, ZERO } from 'constants/index';
import { scamFlag } from 'helpers';
import { NftEnumType, PartialNftType, PartialTokenType } from 'types';
import { FormatAmount } from 'UI';
import styles from './styles.module.scss';

const MultiversXIcon =
  require('./../../../../assets/icons/mx-icon.svg').default;

export interface TokenElementPropsType {
  EgldIcon?: JSXElementConstructor<any>;
  inDropdown?: boolean;
  isEgld?: boolean;
  nftTokenDetails?: PartialNftType;
  nftType?: NftEnumType;
  token: PartialTokenType;
}

export const TokenElement = ({
  EgldIcon,
  inDropdown = false,
  isEgld,
  nftTokenDetails,
  nftType,
  token
}: TokenElementPropsType) => {
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

  const showFormattedValue =
    !inDropdown && nftType !== NftEnumType.NonFungibleESDT;

  let tokenIcon = <div className={styles.tokenElementCircle}>{symbol}</div>;

  if (avatar) {
    tokenIcon = (
      <img
        className={styles.tokenElementCircle}
        src={avatar}
        alt={name}
        height={avatarDropdownSize}
      />
    );
  }

  if (isEgld) {
    tokenIcon = (
      <div className={styles.tokenElementCircle}>
        {EgldIcon ? <EgldIcon height={36} /> : <MultiversXIcon height={36} />}
      </div>
    );
  }

  return (
    <div className={classNames(globals.value, styles.tokenElement)}>
      <div className={styles.tokenElementWrapper}>{tokenIcon}</div>

      <div data-testid={FormDataTestIdsEnum.tokenName}>
        <span data-testid={`${identifier}-element`}>
          <span>{title}</span>{' '}
          <span className={styles.tokenElementIdentifier}>{identifier}</span>
        </span>

        {showFormattedValue && (
          <FormatAmount
            egldLabel={identifier}
            value={balance || ZERO}
            digits={nftType === NftEnumType.SemiFungibleESDT ? 0 : DIGITS}
            token={identifier}
            showLabel={false}
            decimals={decimals}
            data-testid={`${identifier}-balance`}
          />
        )}
      </div>
    </div>
  );
};
