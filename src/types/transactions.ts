import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Transaction } from '@multiversx/sdk-core/out';
import { WithClassnameType } from 'types';

export interface DelegationContractDataType {
  delegationContract: string;
  delegationContractData: {
    minGasLimit: string;
  };
}

export type DeviceSignedTransactions = Record<number, Transaction>;

export interface GuardianScreenType extends WithClassnameType {
  address: string;
  onSignTransaction: () => Promise<void>;
  onPrev: () => void;
  title?: ReactNode;
  signStepInnerClasses?: SignStepInnerClassesType;
  signedTransactions?: DeviceSignedTransactions;
  guardianFormDescription?: ReactNode;
  setSignedTransactions?: Dispatch<
    SetStateAction<DeviceSignedTransactions | undefined>
  >;
}
