import { useEffect } from 'react';
import { useAccountContext } from '../../AccountContext';
import useVerifyScamAddress from './useVerifyScamAddress';

export function useScamError(destinationAddress: string) {
  const { address } = useAccountContext();

  const { verifiedAddresses, verifyScamAddress } = useVerifyScamAddress();
  const scamError = verifiedAddresses[destinationAddress]?.info;

  useEffect(() => {
    if (destinationAddress) {
      verifyScamAddress({
        address,
        addressToVerify: destinationAddress
      });
    }
  }, [destinationAddress]);

  return scamError;
}
