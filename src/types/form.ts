import { Transaction } from '@multiversx/sdk-core/out';
import { TransactionTypeEnum } from 'types/enums';
import { PartialNftType, PartialTokenType } from 'types/tokens';

export enum ValuesEnum {
  receiver = 'receiver',
  gasPrice = 'gasPrice',
  data = 'data',
  tokenId = 'tokenId',
  amount = 'amount',
  gasLimit = 'gasLimit',
  receiverUsername = 'receiverUsername',
  rawReceiverUsername = 'rawReceiverUsername',
  senderUsername = 'senderUsername'
}

export type ValueKeyType = keyof typeof ValuesEnum;

type MandatoryValuesType = {
  [key in ValueKeyType]: string;
};

export interface ValuesType
  extends Omit<
    MandatoryValuesType,
    'receiverUsername' | 'senderUsername' | 'rawReceiverUsername'
  > {
  receiverUsername?: string;
  rawReceiverUsername?: string;
  senderUsername?: string;
}

export interface ExtendedValuesType extends ValuesType {
  // validationSchema
  txType: TransactionTypeEnum;
  address: string;
  isGuarded?: boolean;
  balance: string;
  chainId: string;
  ignoreTokenBalance?: boolean;
  /**
   * **readonly**: Configure disabled fields by disabling all or individual fields.\
   * Example: `readonly: [ 'amount' ]` will disable only the amount field.
   */
  readonly?: boolean | Array<ValueKeyType>;
  hiddenFields?: Array<ValueKeyType>;
  nft?: PartialNftType;
  tokens?: PartialTokenType[] | null;
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
  transaction?: Transaction;
  uiOptions?: {
    showAmountSlider: boolean;
  };
}

export interface ValidationSchemaType {
  txType: TransactionTypeEnum;
  address: string;
  egldLabel: string;
  balance: string;
  chainId: string;
  /**
   * **ignoreTokenBalance**: Gets set automaticaly in case of validating multiple\
   * sign transactions, when some tokens will be available only after execution.
   */
  ignoreTokenBalance?: boolean;
  readonly?: ExtendedValuesType['readonly'];
  tokenId: string;
  nft?: PartialNftType;
  tokens?: PartialTokenType[];
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
}

export interface FormConfigType {
  receiver: string;
  receiverUsername?: string;
  amount: string;
  tokenId?: string;
  gasLimit: string;
  gasPrice: string;
  data: string;

  readonly?: ExtendedValuesType['readonly'];
  successTitle?: string;
  successDescription?: string;
  redirectRoute?: string;
  skipToConfirm?: boolean;
}
