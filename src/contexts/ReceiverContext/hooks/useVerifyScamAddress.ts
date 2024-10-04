import { useState } from 'react';

import { ApiConfigType, getScamAddressData } from 'apiCalls';
import { addressIsValid } from 'helpers';

interface VerifiedAddressesType {
  [address: string]: { type: string; info: string };
}

export function useVerifyScamAddress(apiConfig?: ApiConfigType) {
  const [verifiedAddresses, setVerifiedAddresses] =
    useState<VerifiedAddressesType>({});
  const [fetching, setFetching] = useState(false);

  const verifyScamAddress = async ({
    address,
    addressToVerify = ''
  }: {
    address: string;
    addressToVerify?: string;
  }) => {
    const notSender = address !== addressToVerify;
    const notVerified = !(addressToVerify in verifiedAddresses);

    if (
      notSender &&
      addressIsValid(addressToVerify) &&
      notVerified &&
      !fetching
    ) {
      setFetching(true);
      try {
        const data = await getScamAddressData(addressToVerify, apiConfig);
        setVerifiedAddresses((existing) => ({
          ...existing,
          ...(data.scamInfo ? { [addressToVerify]: data.scamInfo } : {})
        }));
      } catch (err) {
        console.error('Unable to find address', err);
      }
      setFetching(false);
    }
  };

  return {
    verifiedAddresses,
    verifyScamAddress,
    fetchingScamAddress: fetching
  };
}
