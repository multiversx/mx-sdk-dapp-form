import { TransferDataEnum } from 'types';

export const isNftOrMultiEsdtTx = (data: string) =>
  Object.values(TransferDataEnum).some((value) => data.startsWith(value));
