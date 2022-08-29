import {
  GAS_LIMIT,
  TESTNET_EGLD_LABEL
} from '@elrondnetwork/dapp-core/constants/index';

import { FormConfigType } from 'types/form';

export const formConfiguration: FormConfigType = {
  receiver: '',
  amount: '',
  tokenId: TESTNET_EGLD_LABEL,
  gasLimit: String(GAS_LIMIT),
  gasPrice: '0.000000001',
  data: ''
};
