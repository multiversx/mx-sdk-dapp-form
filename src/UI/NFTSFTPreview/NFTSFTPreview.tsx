import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { processScamNft } from 'helpers';
import { PartialNftType, TransactionTypeEnum } from 'types';

import styles from './styles.module.scss';

export interface NFTSFTPreviewPropsType extends PartialNftType {
  txType: TransactionTypeEnum;
  onClick?: (event: MouseEvent) => void;
}

export const NFTSFTPreview = (props: NFTSFTPreviewPropsType) => {
  const { txType, onClick, collection, ...nft } = props;
  const { name, thumbnail } = processScamNft({
    nft
  });

  const badge = txType === TransactionTypeEnum.NonFungibleESDT ? 'NFT' : 'SFT';

  return (
    <div
      onClick={onClick}
      className={classNames(styles.preview, {
        [styles.clickable]: Boolean(onClick)
      })}
    >
      <img src={thumbnail} className={styles.image} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.name}>{name}</div>
          <div className={styles.collection}>{collection}</div>
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
