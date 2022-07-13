import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { Token, TokenPropsType } from 'UI/Confirm/Token';

const NftSftToken = () => {
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
    tokenIdError
  };

  return <Token {...tokenProps} />;
};

export { NftSftToken };
