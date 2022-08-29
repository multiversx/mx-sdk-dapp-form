import {
  fallbackNetworkConfigurations,
  TESTNET_EGLD_LABEL,
  TESTNET_CHAIN_ID
} from '@elrondnetwork/dapp-core/constants/index';
import { EnvironmentsEnum } from '@elrondnetwork/dapp-core/types/enums.types';
import { testAddress } from '__mocks__';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.testnet];

export const accountConfiguration = {
  egldLabel: TESTNET_EGLD_LABEL,
  address: testAddress,
  chainId: TESTNET_CHAIN_ID,
  balance: '812350000000000000',
  nonce: 0,
  networkConfig: activeNetwork
};
