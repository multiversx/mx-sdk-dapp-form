import { useEffect, useState } from 'react';
import { getTransactions } from '@multiversx/sdk-dapp/apiCalls/transactions/getTransactions';
import { ServerTransactionType } from '@multiversx/sdk-dapp/types';
import uniqBy from 'lodash/uniqBy';

import { getApiConfig } from 'apiCalls';

import { useAccountContext } from '../../AccountContext';
import { trimReceiverDomain } from '../helpers';
import { KnowAddressType } from '../ReceiverContext';

export function useFetchKnownAddresses() {
  const { address } = useAccountContext();

  const [knownAddresses, setKnownAddresses] = useState<
    KnowAddressType[] | null
  >(null);

  async function getKnownAddresses() {
    try {
      const apiConfig = await getApiConfig();
      const { data: resolvedTransactions } = await getTransactions({
        sender: address,
        receiver: address,
        transactionSize: 50,
        apiAddress: apiConfig.baseURL,
        apiTimeout: apiConfig.timeout,
        withUsername: true
      });

      const knownAddresses: KnowAddressType[] = resolvedTransactions.reduce(
        (previous: ServerTransactionType[], current: ServerTransactionType) => {
          const receiver = {
            address: current.receiver,
            username: trimReceiverDomain(current.receiverAssets?.name)
          };

          const sender = {
            address: current.sender,
            username: trimReceiverDomain(current.senderAssets?.name)
          };

          return current ? [...previous, receiver, sender] : previous;
        },
        []
      );

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
