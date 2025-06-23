import { TESTNET_EGLD_LABEL } from '@multiversx/sdk-dapp/out/constants';

import { FormConfigType } from 'types/form';

export const formConfiguration: FormConfigType = {
  receiver: '',
  amount: '',
  tokenId: TESTNET_EGLD_LABEL,
  gasLimit: '100000',
  gasPrice: '0.000000001',
  data: ''
};
