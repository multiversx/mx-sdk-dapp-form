import { useEffect, useState } from 'react';
import { getEconomicsInfo } from 'apiCalls';
import { decimals } from 'constants/index';

interface EconomicsInfoType {
  egldPriceInUsd: number;
  decimals: number;
}

const initialState = {
  egldPriceInUsd: 0,
  decimals
};

export function useGetEconomicsInfo(): EconomicsInfoType {
  const [economicsInfo, setEconomicsInfo] =
    useState<EconomicsInfoType>(initialState);

  async function fetchEconomicsInfo() {
    const economicsResponse = await getEconomicsInfo();

    const egldPriceInUsd =
      economicsResponse?.price || initialState.egldPriceInUsd;

    setEconomicsInfo({ egldPriceInUsd, decimals });
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, []);

  return economicsInfo;
}
