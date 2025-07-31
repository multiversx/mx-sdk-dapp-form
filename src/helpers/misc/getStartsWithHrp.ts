import { LibraryConfig } from '@multiversx/sdk-core';

export const getStartsWithHrp = (value?: string): boolean => {
  return Boolean(
    value
      ?.toLowerCase()
      .startsWith(LibraryConfig.DefaultAddressHrp.toLowerCase())
  );
};
