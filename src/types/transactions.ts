import { NftEnumType } from 'types/enums';

export interface TxOperationType {
  action: string;
  type: string;
  esdtType: NftEnumType | 'FungibleESDT';
  identifier: string;
  sender: string;
  receiver: string;
  value: string;
  decimals?: number;
}

export interface TransactionType {
  fee?: string;
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: string;
  txHash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: string;
  timestamp: number;
  value: string;
  results?: ScResultType[];
  operations?: TxOperationType[];
  scamInfo?: {
    type: string;
    info: string;
  };
}

export interface ScResultType {
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  hash: string;
  originalTxHash: string;
  receiver?: string;
  sender: string;
  timestamp: number;
  value: string;
  data?: string;
  returnMessage?: string;
}

export interface SmartContractResult {
  hash: string;
  timestamp: number;
  nonce: number;
  gasLimit: number;
  gasPrice: number;
  value: string;
  sender: string;
  receiver: string;
  data: string;
  prevTxHash: string;
  originalTxHash: string;
  callType: string;
  miniBlockHash: string;
  returnMessage: string;
}

export interface DelegationContractDataType {
  delegationContract: string;
  delegationContractData: {
    minGasLimit: string;
  };
}
