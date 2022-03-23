import { useEffect } from 'react';
import { useAccountContext } from '../../AccountContext';
import useVerifyScamAddress from './useVerifyScamAddress';

export function useScamError(receiver: string) {
  const { address } = useAccountContext();

  const { verifiedAddresses, verifyScamAddress } = useVerifyScamAddress();
  const scamError = verifiedAddresses[receiver]?.info;

  useEffect(() => {
    if (receiver) {
      verifyScamAddress({
        address,
        addressToVerify: receiver
      });
    }
  }, [receiver]);

  return scamError;
}
