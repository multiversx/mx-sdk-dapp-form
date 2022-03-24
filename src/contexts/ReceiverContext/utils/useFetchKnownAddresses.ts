import { useEffect, useState } from 'react';
import uniq from 'lodash/uniq';
import { getTransactions } from 'apiCalls';
import { useAccountContext } from '../../AccountContext';

export function useFetchKnownAddresses() {
  const { address } = useAccountContext();

  const [knownAddresses, setKnownAddresses] = useState<string[]>([]);

  async function getKnownAddresses() {
    try {
      const { data: resolvedTransactions } = await getTransactions({
        address,
        transactionSize: 50
      });

      const addresses = resolvedTransactions.reduce((prev, curr) => {
        return [...prev, curr.receiver, curr.sender];
      }, [] as string[]);

      const uniqAddresses = uniq(addresses);
      setKnownAddresses(uniqAddresses);
    } catch (error) {
      console.error('Unable to fetch transactions', error);
      setKnownAddresses([]);
    }
  }

  useEffect(() => {
    getKnownAddresses();
  }, []);

  return knownAddresses;
}
