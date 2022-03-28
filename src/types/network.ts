interface BaseNetworkConfigType {
  chainId: string;
  apiAddress?: never;
  egldLabel?: never;
}

interface FullNetworkConfigType {
  chainId: string;
  apiAddress: string;
  egldLabel: string;
}

export type FormNetworkConfigType =
  | BaseNetworkConfigType
  | FullNetworkConfigType;
