import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import { Token, TokenPropsType } from 'UI/Confirm/Token';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

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
