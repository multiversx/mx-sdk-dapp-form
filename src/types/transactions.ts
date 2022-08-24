import { SmartContractResult as ScResult } from '@elrondnetwork/dapp-core/types/index';
import {
  ServerTransactionType,
  ScResultType as SmartContractResultType,
  OperationType
} from '@elrondnetwork/dapp-core/types/server-transactions';

export type TxOperationType = OperationType;

export type TransactionType = ServerTransactionType;

export type ScResultType = SmartContractResultType;

export type SmartContractResult = ScResult;

export interface DelegationContractDataType {
  delegationContract: string;
  delegationContractData: {
    minGasLimit: string;
  };
}
