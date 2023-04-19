import { getScamFlag } from '@multiversx/sdk-dapp/utils';

import type { ProcessScamNftType } from './types';
// import placeholder from 'assets/img/nft-image-placeholder.png';

export const processScamNft = ({
  nft,
  skipDescription
}: ProcessScamNftType) => {
  const { name, metadata, media, isNsfw, scamInfo, verified } = nft;

  const messagePrefix = 'Scam - ';

  const { isSuspicious: isSuspiciousName, message } = getScamFlag({
    verified,
    message: name,
    isNsfw,
    scamInfo,
    messagePrefix
  });

  if (!metadata?.description || skipDescription) {
    const thumbnail = isSuspiciousName
      ? 'placeholder'
      : media?.[0]?.thumbnailUrl;

    return {
      isSuspicious: isSuspiciousName,
      name: name || message,
      thumbnail,
      description: ''
    };
  }

  // Check if description is suspicious
  const { message: description, isSuspicious: isSuspiciousMetadata } =
    getScamFlag({
      message: metadata.description,
      messagePrefix,
      verified
    });

  const isSuspicious = isSuspiciousName || isSuspiciousMetadata;
  const thumbnail = isSuspicious ? 'placeholder' : media?.[0]?.thumbnailUrl;

  return {
    isSuspicious,
    name: name || message,
    thumbnail,
    description: description || metadata.description
  };
};
