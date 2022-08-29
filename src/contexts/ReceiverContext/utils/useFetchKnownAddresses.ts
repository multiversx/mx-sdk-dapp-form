import { useEffect, useState } from 'react';
import { getTransactions } from '@elrondnetwork/dapp-core/apiCalls/transactions/getTransactions';
import { ServerTransactionType } from '@elrondnetwork/dapp-core/types';
import uniq from 'lodash/uniq';
import { getApiConfig } from 'apiCalls';
import { useAccountContext } from '../../AccountContext';

export function useFetchKnownAddresses() {
  const { address } = useAccountContext();

  const [knownAddresses, setKnownAddresses] = useState<string[]>([]);

  async function getKnownAddresses() {
    try {
      const apiConfig = await getApiConfig();
      const { data: resolvedTransactions } = await getTransactions({
        sender: address,
        receiver: address,
        transactionSize: 50,
        apiAddress: apiConfig.baseURL,
        apiTimeout: apiConfig.timeout
      });

      const addresses: string[] = resolvedTransactions.reduce(
        (prev: ServerTransactionType[], curr: ServerTransactionType) => {
          return curr ? [...prev, curr.receiver, curr.sender] : prev;
        },
        []
      );

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
