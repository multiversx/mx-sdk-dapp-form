import { useEffect } from 'react';
import { useVerifyScamAddress } from './useVerifyScamAddress';
import { useAccountContext } from '../../AccountContext';

export function useScamError(receiver: string) {
  const { address } = useAccountContext();

  const { verifiedAddresses, verifyScamAddress, fetchingScamAddress } =
    useVerifyScamAddress();
  const scamError = verifiedAddresses[receiver]?.info;

  useEffect(() => {
    if (receiver) {
      verifyScamAddress({
        address,
        addressToVerify: receiver
      });
    }
  }, [receiver]);

  return { scamError, fetchingScamAddress };
}
