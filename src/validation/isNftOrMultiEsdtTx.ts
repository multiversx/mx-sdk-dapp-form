import { TransferDataEnum } from 'types';

export function isNftOrMultiEsdtTx(data: string) {
  return (
    typeof data === 'string' &&
    (data.startsWith(TransferDataEnum.ESDTNFTCreate) ||
      data.startsWith(TransferDataEnum.ESDTNFTTransfer) ||
      data.startsWith(TransferDataEnum.MultiESDTNFTTransfer))
  );
}

export default isNftOrMultiEsdtTx;
