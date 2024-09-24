import React, { JSXElementConstructor } from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { TransactionTypeEnum } from 'types';

export interface TokenAvatarPropsType {
  EgldIcon?: JSXElementConstructor<any>;
  avatar?: string;
  type: TransactionTypeEnum;
}

const MultiversXIcon = require('../../../assets/icons/mx-icon.svg').default;

export const TokenAvatarComponent = (
  props: TokenAvatarPropsType & WithStylesImportType
) => {
  const { avatar, type, styles } = props;

  if (type === TransactionTypeEnum.NonFungibleESDT) {
    return (
      <div className={classNames(styles?.tokenAvatar, styles?.tokenAvatarNFT)}>
        NFT
      </div>
    );
  }

  if (type === TransactionTypeEnum.SemiFungibleESDT) {
    return (
      <div className={classNames(styles?.tokenAvatar, styles?.tokenAvatarSFT)}>
        SFT
      </div>
    );
  }

  if (type === TransactionTypeEnum.EGLD) {
    return (
      <div className={styles?.tokenAvatar}>
        {props.EgldIcon ? <props.EgldIcon /> : <MultiversXIcon />}
      </div>
    );
  }

  if (avatar) {
    return (
      <div className={styles?.tokenAvatar}>
        <img src={avatar} />
      </div>
    );
  }

  return (
    <div className={styles?.tokenAvatar}>
      <FontAwesomeIcon icon={faDiamond} />
    </div>
  );
};

export const TokenAvatar = withStyles(TokenAvatarComponent, {
  ssrStyles: () => import('UI/Confirm/TokenAvatar/styles.scss'),
  clientStyles: () => require('UI/Confirm/TokenAvatar/styles.scss').default
});
