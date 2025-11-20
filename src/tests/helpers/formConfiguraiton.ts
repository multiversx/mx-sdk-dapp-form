import { GAS_LIMIT } from '@multiversx/sdk-dapp/out/constants/mvx.constants';
import { TESTNET_EGLD_LABEL } from '@multiversx/sdk-dapp/out/constants/network.constants';

import { FormConfigType } from 'types/form';

export const formConfiguration: FormConfigType = {
  receiver: '',
  amount: '',
  tokenId: TESTNET_EGLD_LABEL,
  gasLimit: String(GAS_LIMIT),
  gasPrice: '0.000000001',
  data: ''
};
