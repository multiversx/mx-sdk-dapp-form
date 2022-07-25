import { TxTypeEnum } from 'types/enums';
import { NftType, TokenType } from 'types/tokens';

export interface ValuesType {
  receiver: string;
  gasPrice: string;
  data: string;
  tokenId: string;
  amount: string;
  gasLimit: string;
}
export interface ExtendedValuesType extends ValuesType {
  // validationSchema
  txType: TxTypeEnum;
  address: string;
  balance: string;
  customBalanceRules?: FormConfigType['customBalanceRules'];

  chainId: string;
  ignoreTokenBalance?: boolean;
  readonly?: boolean;
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
  readonly?: boolean;
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
  /**
   * **readonly**: Configure the form with disabled fields
   */
  readonly?: boolean;
  successTitle?: string;
  successDescription?: string;
  redirectRoute?: string;
  skipToConfirm?: boolean;
}
