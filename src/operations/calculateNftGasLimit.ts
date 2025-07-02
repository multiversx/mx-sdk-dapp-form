import { GAS_PER_DATA_BYTE } from '@multiversx/sdk-dapp/out/constants';
import {
  MIN_NFT_GAS_LIMIT,
  MAX_NFT_GAS_LIMIT,
  BURN_NFT_GAS_LIMIT
} from 'constants/index';
import { TransferDataEnum } from '../types';

export const calculateNftGasLimit = (data = '') => {
  const computedDataGasLimit =
    MIN_NFT_GAS_LIMIT + data.length * GAS_PER_DATA_BYTE;

  if (data.startsWith(TransferDataEnum.ESDTNFTBurn)) {
    return BURN_NFT_GAS_LIMIT.toString();
  }

  return String(Math.max(computedDataGasLimit, MAX_NFT_GAS_LIMIT));
};
