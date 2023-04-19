import type { SuspiciousLinkPropsType } from '@multiversx/sdk-dapp/types';
import type { PartialNftType } from 'types';

export interface KeyValueType {
  key: string;
  value: string;
}

export interface NftAttributeType {
  attribute: [KeyValueType];
}

export interface NftMetadataType {
  description: string;
  attributes: [NftAttributeType];
}

export interface NftType
  extends Pick<SuspiciousLinkPropsType, 'isNsfw' | 'verified' | 'scamInfo'>,
    Pick<PartialNftType, 'name' | 'media'> {
  metadata?: NftMetadataType;
}

export interface ProcessScamNftType {
  nft: NftType;
  skipDescription?: boolean;
}
