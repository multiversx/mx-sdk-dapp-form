import { useEffect, useState } from 'react';
import { constants } from '@elrondnetwork/dapp-core';
import { getEconomicsInfo } from 'apiCalls';
import { useNetworkConfigContext } from 'contexts/NetworkContext';

interface EconomicsInfoType {
  egldPriceInUsd: number;
  decimals: number;
  egldLabel: string;
}

const initialState = {
  egldPriceInUsd: 0,
  decimals: constants.decimals,
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
      decimals: constants.decimals,
      egldLabel: networkConfig.egldLabel
    });
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, [networkConfig?.id]);

  return economicsInfo;
}
