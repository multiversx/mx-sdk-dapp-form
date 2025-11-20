export interface ExistingNftType {
  collection: string;
  nonce: string;
  quantity: string;
  receiver: string;
}

export interface SearchNFTPropsType {
  data: string;
  address: string;
  nft?: ExistingNftType;
}
