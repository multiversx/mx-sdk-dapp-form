import { TransferDataEnum } from '../types';

export const calculateNftGasLimit = (data = '') => {
  const computedDataGasLimit = 750_000 + data.length * 1_500;

  if (data.startsWith(TransferDataEnum.ESDTNFTBurn)) {
    return (200_000).toString();
  }

  return String(Math.max(computedDataGasLimit, 1_000_000));
};
