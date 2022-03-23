import { NftEnumType, TxTypeEnum } from 'types/enums';
import { TransactionType } from './transactions';

export interface TokenType {
  identifier: string;
  name: string;
  decimals: number;
  balance: string;
  ticker: string;
  assets?: TokenAssetsType;
}

export interface SelectedTokenType extends TokenType {
  type: TxTypeEnum;
}

export interface TokenAssetsType {
  description?: string;
  pngUrl?: string;
  status?: string;
  svgUrl?: string;
  website?: string;
  ledgerSignature?: string;
}

interface NftMediaType {
  url: string;
  originalUrl: string;
  thumbnailUrl: string;
  fileType: string;
  fileSize: number;
}

interface SharedNftType {
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canTransferNFTCreateRole: boolean;
  balance: string;
  identifier: string;
  decimals: number;
  name: string;
  nonce: string;
  creator: string;
  scamInfo?: TransactionType['scamInfo'];
  uris?: (string | null | undefined)[];
  media?: NftMediaType[];
}

type SharedTokenType = TokenType & {
  owner: string;
};

export type NftType = SharedTokenType &
  SharedNftType & {
    type: NftEnumType;
    collection: string;
    assets?: TokenAssetsType;
  };

export type MetaEsdtType = SharedTokenType &
  SharedNftType & {
    type: NftEnumType.MetaESDT;
    collection: string;
    assets?: TokenAssetsType;
  };
