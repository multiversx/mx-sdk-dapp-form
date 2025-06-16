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
  address: string;
  balance: string;
  chainId: string;
  hiddenFields?: Array<ValueKeyType>;
  ignoreTokenBalance?: boolean;
  isAdvancedModeEnabled?: boolean;
  isBurn?: boolean;
  isGuarded?: boolean;
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
  nft?: PartialNftType;
  /**
   * **readonly**: Configure disabled fields by disabling all or individual fields.\
   * Example: `readonly: [ 'amount' ]` will disable only the amount field.
   */
  readonly?: boolean | Array<ValueKeyType>;
  /**
   * **relayer**: Address of the relayer account to fetch and use for gas limit validation
   * instead of the sender account.
   */
  relayer?: string;
  relayerBalance?: string;
  tokens?: PartialTokenType[] | null;
  transaction?: Transaction;
  txType: TransactionTypeEnum;
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
  /**
   * **relayer**: Address of the relayer account to fetch and use for gas limit validation
   * instead of the sender account.
   */
  relayer?: string;
  relayerBalance?: string;
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
