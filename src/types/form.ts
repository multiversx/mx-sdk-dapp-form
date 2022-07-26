import { TxTypeEnum } from 'types/enums';
import { NftType, TokenType } from 'types/tokens';

export enum ValuesEnum {
  receiver = 'receiver',
  gasPrice = 'gasPrice',
  data = 'data',
  tokenId = 'tokenId',
  amount = 'amount',
  gasLimit = 'gasLimit'
}

type ValueKeyType = keyof typeof ValuesEnum;

export type ValuesType = {
  [key in ValueKeyType]: string;
};

export interface ExtendedValuesType extends ValuesType {
  // validationSchema
  txType: TxTypeEnum;
  address: string;
  balance: string;
  customBalanceRules?: FormConfigType['customBalanceRules'];

  chainId: string;
  ignoreTokenBalance?: boolean;
  /**
   * **readonly**: Configure disabled fields by disabling all or individual fields.\
   * Example: `readonly: [ 'amount' ]` will disable only the amount field.
   */
  readonly?: boolean | Array<ValueKeyType>;
  nft?: NftType;
  tokens?: TokenType[] | null;
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
}

export interface ValidationSchemaType {
  txType: TxTypeEnum;
  address: string;
  egldLabel: string;
  balance: string;
  chainId: string;
  /**
   * **ignoreTokenBalance**: Gets set automaticaly in case of validating multiple
   * sign transactions when some tokens will be available only after execution
   */
  ignoreTokenBalance?: boolean;
  /**
   * **readonly**: Configure disabled fields by disabling all or individual
   * example: readonly: { amount: false } will disable all but amount field
   */
  readonly?: ExtendedValuesType['readonly'];
  tokenId: string;
  nft?: NftType;
  tokens?: TokenType[];
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
}

export interface FormConfigType {
  receiver: string;
  amount: string;
  tokenId?: string;
  gasLimit: string;
  gasPrice: string;
  data: string;

  customBalanceRules?: {
    /**
     * **customBalance**: Used to configure EGLD balance when widthdrawing from a contract
     */
    customBalance?: string;
    minAmount?: string;
    dataFieldBuilder?: (props: ValuesType) => string;
  };

  readonly?: ExtendedValuesType['readonly'];
  successTitle?: string;
  successDescription?: string;
  redirectRoute?: string;
  skipToConfirm?: boolean;
}
