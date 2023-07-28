import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { FormTestIdsEnum } from 'constants/dataTestIds';
import { FormContextPropsType } from 'contexts';
import { processScamNft } from 'helpers';
import { PartialNftType, TransactionTypeEnum } from 'types';

import styles from './styles.module.scss';

export interface NFTSFTPreviewPropsType extends PartialNftType {
  txType: TransactionTypeEnum;
  onClick?: FormContextPropsType['onPreviewClick'];
}

export const NFTSFTPreview = (props: NFTSFTPreviewPropsType) => {
  const { txType, onClick, identifier, ...nft } = props;
  const { name, thumbnail } = processScamNft({
    nft
  });

  const isNFTorSFT = [
    TransactionTypeEnum.NonFungibleESDT,
    TransactionTypeEnum.SemiFungibleESDT
  ].includes(txType);

  const badge = txType === TransactionTypeEnum.NonFungibleESDT ? 'NFT' : 'SFT';
  const onPreviewClick = (event: MouseEvent) => {
    event.preventDefault();

    if (onClick) {
      onClick(event, Object.assign(nft, { identifier }));
    }
  };

  if (!isNFTorSFT) {
    return null;
  }

  return (
    <div
      onClick={onPreviewClick}
      data-testid={FormTestIdsEnum.tokenPreview}
      className={classNames(styles.preview, {
        [styles.clickable]: Boolean(onClick)
      })}
    >
      <img src={thumbnail} className={styles.image} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div
            data-testid={FormTestIdsEnum.tokenPreviewName}
            className={styles.name}
          >
            {name}
          </div>

          <div
            data-testid={FormTestIdsEnum.tokenPreviewIdentifier}
            className={styles.identifier}
          >
            {identifier}
          </div>
        </div>

        <div className={styles.right}>
          <div
            className={classNames(styles.badge, {
              [styles.nft]: txType === TransactionTypeEnum.NonFungibleESDT,
              [styles.sft]: txType === TransactionTypeEnum.SemiFungibleESDT
            })}
          >
            {badge}
          </div>
        </div>
      </div>
    </div>
  );
};
