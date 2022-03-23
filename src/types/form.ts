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

export interface ValidationSchemaType {
  txType: TxTypeEnum;
  address: string;
  egldLabel: string;
  balance: string;
  chainId: string;
  ignoreTokenBalance?: boolean;
  readonly?: boolean;
  tokenId: string;
  nft?: NftType;
  tokens?: TokenType[];
  ledger?: {
    ledgerDataActive: boolean;
    ledgerHashSignMinimumVersion: number;
    ledgerWithHashSign: boolean;
  };
}
