import { useEffect, useState } from 'react';
import { getTransactions } from '@multiversx/sdk-dapp/apiCalls/transactions/getTransactions';
import uniqBy from 'lodash/uniqBy';

import { getApiConfig } from 'apiCalls';
import { useAccountContext } from 'contexts/AccountContext';
import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';
import { formatAddressesFromTransactions } from './helpers';

export function useFetchKnownAddresses() {
  const { address } = useAccountContext();

  const [knownAddresses, setKnownAddresses] = useState<
    KnowAddressType[] | null
  >(null);

  async function getKnownAddresses() {
    try {
      const apiConfig = await getApiConfig();
      const { data: transactions } = await getTransactions({
        sender: address,
        transactionSize: 50,
        apiAddress: apiConfig.baseURL,
        apiTimeout: apiConfig.timeout,
        withUsername: true
      });

      const knownAddresses = formatAddressesFromTransactions(transactions);

      const uniqueKnownAddresses = uniqBy(
        knownAddresses,
        (knowAddress) => knowAddress.address
      );

      setKnownAddresses(uniqueKnownAddresses);
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
