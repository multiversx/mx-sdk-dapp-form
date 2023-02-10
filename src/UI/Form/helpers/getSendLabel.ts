import { TokensContextPropsType } from 'contexts/TokensContext';
import { NftEnumType } from 'types/enums';

export const getSendLabel = (tokensInfo: TokensContextPropsType) => {
  if (tokensInfo.nft?.type === NftEnumType.NonFungibleESDT) {
    return 'NFT';
  }
  if (tokensInfo.nft?.type === NftEnumType.SemiFungibleESDT) {
    return 'SFT';
  }
  return tokensInfo.tokenDetails.ticker;
};
