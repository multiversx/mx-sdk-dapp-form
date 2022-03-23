import { useEffect, useState } from 'react';
import { apiCalls } from '@elrondnetwork/dapp-core';
import { getEconomicsInfo } from 'apiRequests';
import { decimals as configDecimals } from 'config';
import { useAccountContext } from '../../AccountContext';

interface EconomicsInfoType {
  egldLabel: string;
  egldPriceInUsd: number;
  decimals: number;
}

const chainIDToEnvironment: Record<string, string> = {
  D: 'devnet',
  T: 'testnet',
  '1': 'mainnet'
};

const initialState = {
  egldLabel: 'eGLD',
  egldPriceInUsd: 0,
  decimals: configDecimals
};

export function useGetEconomicsInfo(): EconomicsInfoType {
  const [economicsInfo, setEconomicsInfo] =
    useState<EconomicsInfoType>(initialState);
  const { chainId } = useAccountContext();

  async function fetchEconomicsInfo() {
    const economicsResponse = await getEconomicsInfo();

    const egldPriceInUsd =
      economicsResponse?.price || initialState.egldPriceInUsd;
    const environment = chainIDToEnvironment[chainId];
    const config = await apiCalls.getServerConfigurationForEnvironment(
      environment
    );
    const egldLabel = config?.egldLabel || initialState.egldLabel;
    const decimals = config?.decimals || initialState.decimals;
    setEconomicsInfo({ egldLabel, egldPriceInUsd, decimals });
  }

  useEffect(() => {
    fetchEconomicsInfo();
  }, []);

  return economicsInfo;
}
