import { useEffect, useState } from 'react';
import { constants } from '@elrondnetwork/dapp-core';
import { getEconomicsInfo } from 'apiCalls';
import { useNetworkConfigContext } from 'contexts/NetworkContext';

interface EconomicsInfoType {
  egldPriceInUsd: number;
  decimals: number;
  egldLabel: string;
}

export function useGetEconomicsInfo(): EconomicsInfoType {
  const { networkConfig } = useNetworkConfigContext();
  const [egldPriceInUsd, setEgldPriceInUsd] = useState<number>(0);

  async function fetchEconomicsInfo() {
    const economicsResponse = await getEconomicsInfo();

    const newPrice = economicsResponse?.price || 0;

    setEgldPriceInUsd(newPrice);
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, [networkConfig?.id]);

  return {
    egldLabel: networkConfig.egldLabel,
    egldPriceInUsd,
    decimals: constants.decimals
  };
}
