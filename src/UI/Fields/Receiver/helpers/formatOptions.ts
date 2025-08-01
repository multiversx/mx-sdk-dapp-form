import { trimUsernameDomain } from '@multiversx/sdk-dapp/out/utils/account/trimUsernameDomain';
import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import { KnowAddressType } from 'contexts';

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
