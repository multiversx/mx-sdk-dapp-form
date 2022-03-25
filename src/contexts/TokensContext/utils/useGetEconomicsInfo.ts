import { useEffect, useState } from 'react';
import { getEconomicsInfo } from 'apiCalls';
import { decimals } from 'constants/index';
import { useNetworkConfigContext } from 'contexts/NetworkContext';

interface EconomicsInfoType {
  egldPriceInUsd: number;
  decimals: number;
  egldLabel: string;
}

const initialState = {
  egldPriceInUsd: 0,
  decimals,
  egldLabel: 'EGLD'
};

export function useGetEconomicsInfo(): EconomicsInfoType {
  const [economicsInfo, setEconomicsInfo] =
    useState<EconomicsInfoType>(initialState);
  const { networkConfig } = useNetworkConfigContext();

  async function fetchEconomicsInfo() {
    const economicsResponse = await getEconomicsInfo();

    const egldPriceInUsd =
      economicsResponse?.price || initialState.egldPriceInUsd;

    setEconomicsInfo({
      egldPriceInUsd,
      decimals,
      egldLabel: networkConfig.egldLabel
    });
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, []);

  return economicsInfo;
}
