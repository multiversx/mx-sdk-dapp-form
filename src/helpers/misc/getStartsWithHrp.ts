import { LibraryConfig } from '@multiversx/sdk-core';

export const getStartsWithHrp = (value?: string) => {
  return Boolean(
    value?.startsWith(LibraryConfig.DefaultAddressHrp.toLowerCase())
  );
};
