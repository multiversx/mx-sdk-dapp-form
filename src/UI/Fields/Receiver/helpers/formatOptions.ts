import { addressIsValid } from '@multiversx/sdk-dapp/utils';

import { KnowAddressType } from 'contexts';

export const formatOptions = (knownAddresses: KnowAddressType[] | null) => {
  if (!knownAddresses) {
    return [];
  }

  const validAddressOptions = knownAddresses.filter((knownAddress) =>
    addressIsValid(knownAddress.address)
  );

  const formattedOptions = validAddressOptions.map((knownAddress) => ({
    value: knownAddress.address,
    label: knownAddress.username ?? knownAddress.address
  }));

  return formattedOptions;
};
