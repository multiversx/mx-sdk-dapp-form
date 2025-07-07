export type FormNetworkConfigType = {
  chainId: string;
  apiAddress?: string;
  egldLabel?: string;
  apiTimeout?: number;
  skipFetchFromServer?: boolean;
  headers?: Record<string, string>;
};
