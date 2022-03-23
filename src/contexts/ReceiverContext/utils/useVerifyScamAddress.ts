import * as React from 'react';
import { addressIsValid } from '@elrondnetwork/dapp-core';
import { checkScamAddress } from '../../../logic/apiCalls';

interface VerifiedAddressesType {
  [address: string]: { type: string; info: string };
}

export function useVerifyScamAddress() {
  const [verifiedAddresses, setVerifiedAddresses] =
    React.useState<VerifiedAddressesType>({});
  const [fetching, setFetching] = React.useState(false);

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
        const data = await checkScamAddress(addressToVerify);
        setVerifiedAddresses((existing) => ({
          ...existing,
          ...(data.scamInfo ? { [addressToVerify]: data.scamInfo } : {})
        }));
      } catch (err) {
        console.error('Unable to verify address', err);
      }
      setFetching(false);
    }
  };

  return {
    verifiedAddresses,
    verifyScamAddress
  };
}

export default useVerifyScamAddress;
