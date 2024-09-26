import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { FormContextPropsType } from 'contexts';
import { processScamNft } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { PartialNftType, TransactionTypeEnum } from 'types';

export interface NFTSFTPreviewPropsType extends PartialNftType {
  txType: TransactionTypeEnum;
  onClick?: FormContextPropsType['onPreviewClick'];
}

export const NFTSFTPreviewComponent = (
  props: NFTSFTPreviewPropsType & WithStylesImportType
) => {
  const { txType, onClick, identifier, styles, ...nft } = props;
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
      data-testid={FormDataTestIdsEnum.tokenPreview}
      className={classNames(styles?.preview, {
        [styles?.clickable]: Boolean(onClick)
      })}
    >
      <img src={thumbnail} className={styles?.image} />

      <div className={styles?.content}>
        <div className={styles?.left}>
          <div
            data-testid={FormDataTestIdsEnum.tokenPreviewName}
            className={styles?.name}
          >
            {name}
          </div>

          <div
            data-testid={FormDataTestIdsEnum.tokenPreviewIdentifier}
            className={styles?.identifier}
          >
            {identifier}
          </div>
        </div>

        <div className={styles?.right}>
          <div
            className={classNames(styles?.badge, {
              [styles?.nft]: txType === TransactionTypeEnum.NonFungibleESDT,
              [styles?.sft]: txType === TransactionTypeEnum.SemiFungibleESDT
            })}
          >
            {badge}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NFTSFTPreview = withStyles(NFTSFTPreviewComponent, {
  ssrStyles: () => import('UI/NFTSFTPreview/styles.module.scss'),
  clientStyles: () => require('UI/NFTSFTPreview/styles.module.scss').default
});
