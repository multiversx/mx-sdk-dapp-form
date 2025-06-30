import {
  fallbackNetworkConfigurations,
  TESTNET_EGLD_LABEL,
  TESTNET_CHAIN_ID
} from '@multiversx/sdk-dapp/out/constants';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { testAddress } from '__mocks__';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.testnet];

export const accountConfiguration = {
  egldLabel: TESTNET_EGLD_LABEL,
  address: testAddress,
  chainId: TESTNET_CHAIN_ID,
  balance: '812350000000000000',
  nonce: 0,
  shard: 0,
  networkConfig: activeNetwork
};
