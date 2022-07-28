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
  customBalanceRules?: {
    /**
     * **customBalance**: Used to configure EGLD balance when widthdrawing from a contract
     */
    customBalance?: string;
    dataFieldBuilder?: (props: ValuesType) => string;
  };
  /**
   * **customValidationRules**: Use this to extend form validation by passing an array of tests for one or more form fields.\
   *  Example: `{ amount: [{ title: 'min', message: 'Minimum 2', test: (value) => value > 2 }] }`
   */
  customValidationRules?: {
    [key in ValueKeyType]?: {
      /**
       * **name**: Validation name
       */
      name: string;
      /**
       * **name**: Validation error message
       */
      message: string;
      /**
       * **test**: Test function
       */
      test: (value?: string | undefined) => boolean;
    }[];
  };
  chainId: string;
  ignoreTokenBalance?: boolean;
  /**
   * **readonly**: Configure disabled fields by disabling all or individual fields.
   * Example: `readonly: [ 'amount' ]` will disable only the amount field.
   */
  readonly?: boolean | Array<ValueKeyType>;
  hiddenFields?: Array<ValueKeyType>;
  nft?: NftType;
  tokens?: TokenType[] | null;
  ledger?: {
    ledgerDataActive: boolean;
    version: string;
  };
  /**
   * **uiOptions**: Conditionally control Form visual elements.
   */
  uiOptions?: {
    hideAmountMaxButton: boolean;
    hideAmountSlider: boolean;
  };
}

export interface ValidationSchemaType {
  txType: TxTypeEnum;
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

  customValidationRules?: ExtendedValuesType['customValidationRules'];
  customBalanceRules?: ExtendedValuesType['customBalanceRules'];
  readonly?: ExtendedValuesType['readonly'];
  successTitle?: string;
  successDescription?: string;
  redirectRoute?: string;
  skipToConfirm?: boolean;
}
