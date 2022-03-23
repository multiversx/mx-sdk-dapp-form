import { useEffect, useState } from 'react';
import uniq from 'lodash/uniq';
import { getTransactions } from 'apiRequests';
import { useAccountContext } from '../../AccountContext';

async function fetchKnownAddresses(address: string): Promise<string[]> {
  try {
    const { data: resolvedTransactions } = await getTransactions({
      address,
      transactionSize: 50
    });

    const addresses = resolvedTransactions.reduce((prev, curr) => {
      return [...prev, curr.receiver, curr.sender];
    }, [] as string[]);

    return uniq(addresses);
  } catch (error) {
    console.error('Unable to fetch transactions', error);
    return [];
  }
}

export function useFetchKnownAddresses() {
  const account = useAccountContext();
  const [knownAddresses, setKnownAddresses] = useState<string[]>([]);
  async function getKnownAddresses() {
    const addresses = await fetchKnownAddresses(account.address);
    setKnownAddresses(addresses);
  }

  useEffect(() => {
    getKnownAddresses();
  }, []);

  return knownAddresses;
}
