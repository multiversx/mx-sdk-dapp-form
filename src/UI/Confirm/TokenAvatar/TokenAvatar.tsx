import React from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { TransactionTypeEnum } from 'types';

import styles from './tokenAvatar.styles.scss';

export interface TokenAvatarPropsType {
  type: TransactionTypeEnum;
  avatar?: string;
}

const MultiversXIcon = require('../../../assets/icons/mx-icon.svg').default;

export const TokenAvatar = (props: TokenAvatarPropsType) => {
  const { avatar, type } = props;

  if (type === TransactionTypeEnum.NonFungibleESDT) {
    return (
      <div className={classNames(styles.tokenAvatar, styles.tokenAvatarNFT)}>
        NFT
      </div>
    );
  }

  if (type === TransactionTypeEnum.SemiFungibleESDT) {
    return (
      <div className={classNames(styles.tokenAvatar, styles.tokenAvatarSFT)}>
        SFT
      </div>
    );
  }

  if (type === TransactionTypeEnum.EGLD) {
    return (
      <div className={styles.tokenAvatar}>
        <MultiversXIcon />
      </div>
    );
  }

  if (avatar) {
    return (
      <div className={styles.tokenAvatar}>
        <img src={avatar} />
      </div>
    );
  }

  return (
    <div className={styles.tokenAvatar}>
      <FontAwesomeIcon icon={faDiamond} />
    </div>
  );
};
