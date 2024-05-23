import { useEffect, useState } from 'react';
import { DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { getEconomicsInfo } from 'apiCalls';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

interface EconomicsInfoType {
  egldPriceInUsd: number;
  digits: number;
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
    if (
      ![
        EnvironmentsEnum.mainnet,
        EnvironmentsEnum.testnet,
        EnvironmentsEnum.devnet
      ].includes(networkConfig?.id as EnvironmentsEnum)
    ) {
      return;
    }

    fetchEconomicsInfo();
  }, [networkConfig?.id]);

  return {
    egldLabel: networkConfig.egldLabel,
    egldPriceInUsd,
    digits: DIGITS
  };
}
