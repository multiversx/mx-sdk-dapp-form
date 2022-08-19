import {
  gasLimit,
  testnetEgldLabel
} from '@elrondnetwork/dapp-core/constants/index';

import { FormConfigType } from 'types/form';

export const formConfiguration: FormConfigType = {
  receiver: '',
  amount: '',
  tokenId: testnetEgldLabel,
  gasLimit,
  gasPrice: '0.000000001',
  data: ''
};
