import React from 'react';
import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { Token, TokenPropsType } from 'UI/Confirm/Token';

export const NftSftToken = ({ className }: WithClassnameType) => {
  const { formInfo, tokensInfo } = useSendFormContext();
  const { isEsdtTransaction } = formInfo;
  const { tokenId, nft, tokenIdError, egldLabel } = tokensInfo;

  const tokenAvatar = nft?.assets?.svgUrl || '';

  const tokenProps: TokenPropsType = {
    nft,
    isEsdtTransaction,
    tokenId,
    egldLabel,
    tokenAvatar,
    tokenIdError,
    className
  };

  return <Token {...tokenProps} />;
};
