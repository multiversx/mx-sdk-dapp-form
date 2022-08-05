import {
  fallbackNetworkConfigurations,
  testnetEgldLabel,
  testnetChainId
} from '@elrondnetwork/dapp-core/constants';
import { EnvironmentsEnum } from '@elrondnetwork/dapp-core/types/enums';
import { testAddress } from '__mocks__';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.testnet];

export const accountConfiguration = {
  egldLabel: testnetEgldLabel,
  address: testAddress,
  chainId: testnetChainId,
  balance: '812350000000000000',
  nonce: 0,
  networkConfig: activeNetwork
};
