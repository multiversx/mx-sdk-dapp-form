import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';

import { KnowAddressType } from 'contexts';
import { addressIsValid } from 'helpers';

export const formatOptions = (knownAddresses: KnowAddressType[] | null) => {
  if (!knownAddresses) {
    return [];
  }

  const validAddressOptions = knownAddresses.filter((knownAddress) =>
    addressIsValid(knownAddress.address)
  );

  const formattedOptions = validAddressOptions.map((knownAddress) => {
    const label = knownAddress.username
      ? String(trimUsernameDomain(knownAddress.username))
      : knownAddress.address;

    return {
      value: knownAddress.address,
      label
    };
  });

  return formattedOptions;
};
