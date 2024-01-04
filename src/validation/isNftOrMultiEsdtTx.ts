import { TransferDataEnum } from 'types';

export const isNftOrMultiEsdtTx = (data: string) =>
  typeof data === 'string' &&
  (data.startsWith(TransferDataEnum.ESDTNFTCreate) ||
    data.startsWith(TransferDataEnum.ESDTNFTTransfer) ||
    data.startsWith(TransferDataEnum.ESDTNFTBurn) ||
    data.startsWith(TransferDataEnum.MultiESDTNFTTransfer));
