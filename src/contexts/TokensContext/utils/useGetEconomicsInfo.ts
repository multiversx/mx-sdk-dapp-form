import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { getEconomicsInfo } from 'apiCalls';
import { decimals as configDecimals } from 'constants/index';

interface EconomicsInfoType {
  egldLabel: string;
  egldPriceInUsd: number;
  decimals: number;
}

const initialState = {
  egldLabel: 'eGLD',
  egldPriceInUsd: 0,
  decimals: configDecimals
};

export function useGetEconomicsInfo(): EconomicsInfoType {
  const [economicsInfo, setEconomicsInfo] =
    useState<EconomicsInfoType>(initialState);
  const { networkConfig } = useGetNetworkConfig();

  async function fetchEconomicsInfo() {
    const economicsResponse = await getEconomicsInfo();

    const egldPriceInUsd =
      economicsResponse?.price || initialState.egldPriceInUsd;

    const egldLabel = networkConfig?.egldLabel || initialState.egldLabel;
    const decimals = networkConfig?.decimals || initialState.decimals;
    setEconomicsInfo({ egldLabel, egldPriceInUsd, decimals });
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, []);

  return economicsInfo;
}
